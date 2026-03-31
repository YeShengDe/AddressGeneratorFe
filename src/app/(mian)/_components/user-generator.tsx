'use client';
import {
  CalendarDays,
  Cake,
  Mars,
  MapPin,
  Mail,
  Lock,
  Phone,
  Shuffle,
  History,
  Share,
  User,
  Venus,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useStore } from '../_store';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import Show from '@/components/show';
import { Button } from '@/components/ui/button';
import HistoryDrawer from './history-drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MapAlert } from './map-tips';
import { saveAs } from 'file-saver';
import { toBlob } from 'html-to-image';
import ShareUserDialog from './share-user';
import type { RandomCoordinateTarget } from '@/lib/utils';
import {
  formatAddressPrimaryLine,
  getBirthdayDisplay,
  getGenderDisplay,
  formatPersonName,
  getAddressMetaItems,
  getAvatarDownloadName,
} from '@/lib/user-profile';

interface UserGeneratorProps {
  onGenerateAddress: (
    target?: string | RandomCoordinateTarget
  ) => Promise<void> | void;
  disabled?: boolean;
}

function HoverHint({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 z-[1010] mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900/90 px-2 py-1 text-[11px] text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 md:block">
      {text}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900/90"
      />
    </div>
  );
}

export default function UserGenerator({
  onGenerateAddress,
  disabled = false,
}: UserGeneratorProps) {
  const { user: userInfo, loadingAddress, setHistoryDrawerOpen } = useStore();
  // 生成新地址
  const avatarId = 'yeshengde-user-avatar';
  const formattedName = userInfo ? formatPersonName(userInfo) : '';
  const formattedAddressLine = userInfo
    ? formatAddressPrimaryLine(userInfo.address)
    : '';
  const addressMetaItems = userInfo
    ? getAddressMetaItems(userInfo.address)
    : [];
  const birthdayDisplay = userInfo
    ? getBirthdayDisplay(userInfo.birthday)
    : { date: '', age: '' };
  const genderDisplay = userInfo
    ? getGenderDisplay(userInfo.gender)
    : { label: '', kind: 'unknown' as const };

  const handleGenerateNewAddress = () => {
    if (disabled) {
      return;
    }
    void onGenerateAddress();
  };

  // 打开历史记录
  const handleOpenHistory = () => {
    setHistoryDrawerOpen(true);
  };

  const GenderIcon =
    genderDisplay.kind === 'male'
      ? Mars
      : genderDisplay.kind === 'female'
        ? Venus
        : User;

  // 复制到剪贴板
  const copyToClipboard = async (
    text: string | null | undefined,
    label: string
  ) => {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text || '');
      toast.success(`已复制${label}`, {
        description: text,
        duration: 2000,
        position: 'top-right',
      });
    } catch (err) {
      console.error('复制失败:', err);
      toast.error('复制失败');
    }
  };
  const handleDownloadAvatar = async () => {
    const scale = 2;
    const node = document.getElementById(avatarId);
    if (!node) return;
    const loadingToast = toast.loading('正在下载头像...', {
      position: 'top-right',
    });
    const blob = await toBlob(node, {
      height: node.offsetHeight * scale,
      style: {
        transform: `scale(${scale}) translate(${node.offsetWidth / 2 / scale}px, ${node.offsetHeight / 2 / scale}px)`,
        borderRadius: '0',
        opacity: '1',
      },
      width: node.offsetWidth * scale,
    });
    const name = `${getAvatarDownloadName(
      userInfo ?? {
        firstname: 'user',
        lastname: 'avatar',
        address: {
          street: '',
          streetName: '',
          buildingNumber: '',
          city: '',
          district: '',
          zipcode: '',
          country: '',
          country_code: 'US',
          state: '',
          latitude: 0,
          longitude: 0,
        },
      }
    )}_avatar.png`;
    if (blob) saveAs(blob, name);
    toast.dismiss(loadingToast);
    toast.success('头像已下载为 PNG', {
      position: 'top-right',
      duration: 2000,
    });
  };
  return (
    <div className="absolute bottom-8 left-1 md:bottom-4 md:left-4 z-[1000]  w-[calc(100%-0.5rem)] md:max-w-[400px] md:min-w-[200px] text-[13px]">
      <Card>
        <div className="p-3">
          <div className="space-y-2">
            {/* 头部个人信息 */}
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1">
                <button
                  type="button"
                  className="group relative block cursor-pointer force-pointer bg-transparent p-0 text-left text-lg font-bold text-gray-900 dark:text-gray-100"
                  onClick={() => copyToClipboard(formattedName, '姓名')}
                  title="点击复制姓名"
                >
                  <HoverHint text="点击复制姓名" />
                  <span className="underline-hover">{formattedName}</span>
                </button>
                <div className="flex items-center gap-2 dark:text-gray-400">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="group relative cursor-pointer force-pointer bg-transparent p-0 text-inherit transition-colors"
                      onClick={() =>
                        copyToClipboard(birthdayDisplay.date, '出生日期')
                      }
                      title="点击复制出生日期"
                    >
                      <HoverHint text="点击复制出生日期" />
                      <span className="underline-hover">
                        {birthdayDisplay.date}
                      </span>
                    </button>
                    <span aria-hidden="true" className="text-gray-400">
                      &middot;
                    </span>
                    <button
                      type="button"
                      className="group relative inline-flex cursor-pointer force-pointer items-center gap-1 bg-transparent p-0 text-inherit transition-colors"
                      onClick={() =>
                        copyToClipboard(birthdayDisplay.age, '年龄')
                      }
                      title="点击复制年龄"
                    >
                      <HoverHint text="点击复制年龄" />
                      <Cake className="h-3.5 w-3.5 text-gray-400" />
                      <span className="underline-hover">
                        {birthdayDisplay.age}
                      </span>
                    </button>
                    <span aria-hidden="true" className="text-gray-400">
                      &middot;
                    </span>
                    <button
                      type="button"
                      className="group relative inline-flex cursor-pointer force-pointer items-center gap-1 bg-transparent p-0 text-inherit transition-colors hover:text-gray-500 dark:hover:text-gray-300"
                      onClick={() =>
                        copyToClipboard(genderDisplay.label, '性别')
                      }
                      title={`点击复制性别: ${genderDisplay.label}`}
                      aria-label={`性别 ${genderDisplay.label}`}
                    >
                      <HoverHint text="点击复制性别" />
                      <GenderIcon className="h-3.5 w-3.5" />
                      <span className="underline-hover">
                        {genderDisplay.label}
                      </span>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(userInfo?.phone, '电话号码')}
                  className="group relative flex cursor-pointer force-pointer items-center gap-2 bg-transparent p-0 text-left dark:text-gray-400"
                  title="点击复制电话号码"
                >
                  <HoverHint text="点击复制电话号码" />
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="underline-hover">{userInfo?.phone}</span>
                </button>
              </div>
              <Avatar
                id={avatarId}
                onClick={handleDownloadAvatar}
                className="w-[80px] h-[80px] border-border shadow-md cursor-pointer force-pointer hover:opacity-80 transition-opacity rounded-[20%]"
              >
                <NiceAvatar
                  className="w-full h-full"
                  {...genConfig(userInfo?.email)}
                  shape="square"
                />
              </Avatar>
            </div>

            {/* 联系信息 */}
            <div className="space-y-1 ">
              <button
                type="button"
                className="group relative flex w-full items-center gap-2 rounded bg-transparent p-0 text-left cursor-pointer force-pointer transition-colors"
                onClick={() => copyToClipboard(userInfo?.email, '邮箱地址')}
                title="点击复制邮箱"
              >
                <HoverHint text="点击复制邮箱" />
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="underline-hover break-all">
                  {userInfo?.email}
                </span>
              </button>

              <button
                type="button"
                className="group relative flex w-full items-center gap-2 bg-transparent p-0 text-left cursor-pointer force-pointer transition-colors"
                onClick={() => copyToClipboard(userInfo?.password, '邮箱密码')}
                title="点击复制邮箱密码"
              >
                <HoverHint text="点击复制密码" />
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="underline-hover">{userInfo?.password}</span>
              </button>
            </div>

            {/* 地址信息 */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 relative">
              <Show
                when={!loadingAddress}
                fallback={
                  <div className="space-y-1">
                    <Skeleton className="h-[20px] w-full rounded-sm" />
                    <Skeleton className="h-[20px] w-[60%] rounded-sm " />
                  </div>
                }
              >
                <div className="flex items-start gap-2 rounded transition-colors dark:hover:bg-gray-800">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          userInfo?.display_name || formattedAddressLine,
                          '完整地址'
                        )
                      }
                      title="点击复制完整地址"
                      className="group relative block w-full cursor-pointer force-pointer bg-transparent p-0 text-left underline-hover break-all"
                    >
                      <HoverHint text="点击复制完整地址" />
                      {formattedAddressLine}
                    </button>
                    <div className="text-xs text-gray-500 mt-1 flex gap-2 flex-wrap">
                      {addressMetaItems.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          className="group relative cursor-pointer force-pointer bg-transparent p-0 text-left transition-colors"
                          onClick={() =>
                            copyToClipboard(item.value, item.label)
                          }
                          title={`点击复制${item.label}`}
                        >
                          <HoverHint text={`点击复制${item.label}`} />
                          <span>{item.label}:</span>
                          <span className="underline-hover">{item.value}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <ShareUserDialog>
                    <Badge
                      variant="secondary"
                      className=" absolute right-0 bottom-0"
                    >
                      <Share className="h-3 w-3" />
                    </Badge>
                  </ShareUserDialog>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-2 my-2">
        <Button
          variant="outline"
          className="flex-[4]"
          onClick={handleOpenHistory}
          disabled={disabled}
        >
          <History className="h-3 w-3 mr-1" />
          历史记录
        </Button>
        <Button
          variant="default"
          className="flex-[6] border-[rgba(255,255,255,.1)] border-solid border"
          onClick={handleGenerateNewAddress}
          disabled={disabled}
        >
          <Shuffle className="h-3 w-3 ml-1" />
          生成新地址
        </Button>
      </div>
      <MapAlert />

      {/* 历史记录抽屉 */}
      <HistoryDrawer />
    </div>
  );
}
