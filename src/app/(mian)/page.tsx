'use client';
import { useStore } from './_store';
import { useEffect } from 'react';
import Show from '@/components/show';
import dynamic from 'next/dynamic';
import { getPerson, getRandomCoor } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCoorAddress } from './_api';
import LogoPage from '@/components/logo-page';
import { useShare } from '@/hooks/use-share';
import { useRouter } from 'next/navigation';
import {
  generateValidatedRandomAddress,
  getReverseQueryKey,
  hydrateUserWithReverseGeocode,
  REVERSE_GEOCODE_STALE_TIME,
} from './_lib/random-address';
import { useDebounce } from '@/hooks/use-debounce';

// 动态导入 MapComponent，禁用 SSR
const MapComponent = dynamic(() => import('./_components/map-component'), {
  ssr: false,
  loading: () => <LogoPage />,
});

export default function Page() {
  const {
    coord,
    country_code,
    user,
    setLoadingAddress,
    setCoord,
    setCountryCode,
    setUser,
  } = useStore(); // 获取全局状态管理的 setUser 方法
  const shareData = useShare();
  const router = useRouter();
  const queryClient = useQueryClient();
  const debouncedCoord = useDebounce(coord, 600);

  useEffect(() => {
    let isMounted = true;

    const initializeAddress = async () => {
      // 如果是分享数据先走分享数据
      if (shareData) {
        setCoord([shareData.address.latitude, shareData.address.longitude]);
        setCountryCode(shareData.address.country_code ?? 'us');
        setUser(shareData);
        setLoadingAddress(false);
        router.replace(window.location.pathname, { scroll: false });
        return;
      }

      setLoadingAddress(true);

      try {
        const generated = await generateValidatedRandomAddress(queryClient);

        if (!isMounted) {
          return;
        }

        setCoord(generated.coord);
        setCountryCode(generated.country_code);
        const nextUser = generated.reverse
          ? hydrateUserWithReverseGeocode(
              getPerson(generated.country_code),
              generated.reverse
            )
          : getPerson(generated.country_code);
        setUser(nextUser);
      } catch {
        if (!isMounted) {
          return;
        }

        const fallback = getRandomCoor(undefined, 0.2);
        setCoord(fallback.coord);
        setCountryCode(fallback.country_code);
        setUser(getPerson(fallback.country_code));
      } finally {
        if (isMounted) {
          setLoadingAddress(false);
        }
      }
    };

    void initializeAddress();

    return () => {
      isMounted = false;
    };
  }, [
    queryClient,
    router,
    setCoord,
    setCountryCode,
    setLoadingAddress,
    setUser,
    shareData,
  ]);

  const { isLoading, isError, data } = useQuery({
    queryKey: getReverseQueryKey(debouncedCoord, country_code),
    enabled: !(debouncedCoord[0] === 0 && debouncedCoord[1] === 0),
    queryFn: () =>
      getCoorAddress({
        lat: debouncedCoord[0],
        lon: debouncedCoord[1],
        'accept-language': country_code ?? '',
      }),
    staleTime: REVERSE_GEOCODE_STALE_TIME,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  useEffect(() => {
    setLoadingAddress(isLoading);
  }, [isLoading, setLoadingAddress]);
  useEffect(() => {
    if (data && !isLoading && !isError && user) {
      setUser(hydrateUserWithReverseGeocode(user, data.data));
    }
    // 都需要作为参数给到url
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, isError, setCoord, setCountryCode]);

  return (
    <Show when={!(coord[0] === 0 && coord[1] === 0)} fallback={<LogoPage />}>
      <div className="w-full h-[100dvh] max-h-screen fixed top-0 left-0 z-10">
        <div className="h-full overflow-hidden shadow-lg">
          <MapComponent lat={coord[0]} lon={coord[1]} />
        </div>
      </div>
    </Show>
  );
}
