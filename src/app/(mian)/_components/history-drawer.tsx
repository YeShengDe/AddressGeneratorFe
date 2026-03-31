'use client';

import React from 'react';
import { useStore } from '../_store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Mail, Trash2, RotateCcw, X } from 'lucide-react';
import { toast } from 'sonner';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import Show from '@/components/show';
import { IUser } from '../_type';
import { formatPersonName } from '@/lib/user-profile';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

function formatGeneratedTime(value?: string) {
  if (!value) {
    return '刚刚生成';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '刚刚生成';
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: zhCN,
  });
}

const HistoryDrawer: React.FC = () => {
  const {
    isHistoryDrawerOpen,
    setHistoryDrawerOpen,
    userHistory,
    clearHistory,
    hideHistoryTip,
    setUser,
    setHideHistoryTip,
  } = useStore();
  const [isClearConfirmOpen, setIsClearConfirmOpen] = React.useState(false);
  const sortedHistory = [...userHistory].sort(
    (left, right) =>
      new Date(right.generatedAt ?? 0).getTime() -
      new Date(left.generatedAt ?? 0).getTime()
  );

  const handleSelectUser = (user: IUser.asObject) => {
    setUser(user);
    setHistoryDrawerOpen(false);
    toast.success('已切换到历史记录', {
      description: formatPersonName(user),
      duration: 2000,
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    setIsClearConfirmOpen(false);
    toast.success('历史记录已清空', {
      duration: 2000,
      position: 'top-right',
    });
  };

  return (
    <Sheet open={isHistoryDrawerOpen} onOpenChange={setHistoryDrawerOpen}>
      <SheetContent className="z-[910] flex h-full w-96 flex-col overflow-hidden">
        <SheetClose onClose={() => setHistoryDrawerOpen(false)} />
        <SheetHeader className="space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <SheetTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                历史记录
              </SheetTitle>
              <Show when={sortedHistory.length > 0}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsClearConfirmOpen(true)}
                  className="h-7 px-2 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  清空
                </Button>
              </Show>
            </div>
            <SheetDescription className="mt-1">
              共 {sortedHistory.length} 条，按生成时间排序
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
          <Show when={sortedHistory.length > 0 && !hideHistoryTip}>
            <div className="px-3 pb-3">
              <Alert className="border-yellow-200 bg-yellow-50 pr-10 text-yellow-900 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-100">
                {/* <Info className="h-4 w-4" /> */}
                <AlertDescription>
                  点击任一历史记录即可回填写地址和信息卡。
                </AlertDescription>
                <button
                  type="button"
                  className="absolute right-3 top-3 text-yellow-700/80 transition-colors hover:text-yellow-900 dark:text-yellow-200/80 dark:hover:text-yellow-50"
                  onClick={() => setHideHistoryTip(true)}
                  aria-label="关闭提示"
                >
                  <X className="h-4 w-4" />
                </button>
              </Alert>
            </div>
          </Show>
          <div className="flex-1 overflow-y-auto px-1 pb-4">
            <Show when={sortedHistory.length === 0}>
              <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-gray-500">
                <RotateCcw className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-center">
                  暂无历史记录
                  <br />
                  <span className="text-sm">生成新地址后会自动保存</span>
                </p>
              </div>
            </Show>

            {sortedHistory.map((user, index) => (
              <button
                key={`${user.email}-${index}`}
                type="button"
                className="grid w-full grid-cols-[auto,minmax(0,1fr)] items-center gap-3 rounded-lg border-b border-border/50 px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                onClick={() => handleSelectUser(user)}
              >
                <Avatar className="h-10 w-10 shrink-0 self-center rounded-[20%]">
                  <NiceAvatar
                    className="h-full w-full"
                    {...genConfig(user.email)}
                    shape="square"
                  />
                </Avatar>
                <div className="min-w-0 self-center">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatPersonName(user)}
                    </div>
                    <div className="shrink-0 text-[11px] text-gray-500 dark:text-gray-400">
                      {formatGeneratedTime(user.generatedAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <ResponsiveDialog
          open={isClearConfirmOpen}
          onOpenChange={setIsClearConfirmOpen}
        >
          <ResponsiveDialogContent className="sm:max-w-[400px]">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>清空历史记录？</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                这会删除当前所有历史记录，操作后无法恢复。
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>
            <ResponsiveDialogFooter>
              <ResponsiveDialogClose asChild>
                <Button variant="outline">取消</Button>
              </ResponsiveDialogClose>
              <Button variant="destructive" onClick={handleClearHistory}>
                确认清空
              </Button>
            </ResponsiveDialogFooter>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryDrawer;
