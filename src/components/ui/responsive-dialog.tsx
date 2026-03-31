'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Drawer as DrawerPrimitive } from 'vaul';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

type ResponsiveDialogContextValue = {
  isMobile: boolean;
};

const ResponsiveDialogContext = React.createContext<
  ResponsiveDialogContextValue | undefined
>(undefined);

function useResponsiveDialogContext() {
  const context = React.useContext(ResponsiveDialogContext);

  if (!context) {
    throw new Error(
      'ResponsiveDialog components must be used within ResponsiveDialog'
    );
  }

  return context;
}

function ResponsiveDialog({
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const isMobile = useMobile();
  const Root = isMobile ? DrawerPrimitive.Root : DialogPrimitive.Root;

  return (
    <ResponsiveDialogContext.Provider value={{ isMobile }}>
      <Root {...props}>{children}</Root>
    </ResponsiveDialogContext.Provider>
  );
}

function ResponsiveDialogTrigger({
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  const { isMobile } = useResponsiveDialogContext();
  const Trigger = isMobile ? DrawerPrimitive.Trigger : DialogPrimitive.Trigger;

  return <Trigger {...props}>{children}</Trigger>;
}

function ResponsiveDialogClose({
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  const { isMobile } = useResponsiveDialogContext();
  const Close = isMobile ? DrawerPrimitive.Close : DialogPrimitive.Close;

  return <Close {...props}>{children}</Close>;
}

function ResponsiveDialogContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  const { isMobile } = useResponsiveDialogContext();

  if (isMobile) {
    return (
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-[920] bg-black/80" />
        <DrawerPrimitive.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-[930] mt-24 flex flex-col rounded-t-[10px] border bg-background',
            className
          )}
          {...(props as React.ComponentPropsWithoutRef<
            typeof DrawerPrimitive.Content
          >)}
        >
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  }

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[920] bg-black/80" />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-[50%] top-[50%] z-[930] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function ResponsiveDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isMobile } = useResponsiveDialogContext();

  return (
    <div
      className={cn(
        isMobile
          ? 'grid gap-1.5 p-4 pt-2 text-center sm:text-left'
          : 'flex flex-col space-y-1.5 text-center sm:text-left',
        className
      )}
      {...props}
    />
  );
}

function ResponsiveDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isMobile } = useResponsiveDialogContext();

  return (
    <div
      className={cn(
        isMobile
          ? 'mt-auto flex flex-col gap-2 p-4 pt-0'
          : 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className
      )}
      {...props}
    />
  );
}

const ResponsiveDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  const { isMobile } = useResponsiveDialogContext();
  const Title = isMobile ? DrawerPrimitive.Title : DialogPrimitive.Title;

  return (
    <Title
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    />
  );
});
ResponsiveDialogTitle.displayName = 'ResponsiveDialogTitle';

const ResponsiveDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  const { isMobile } = useResponsiveDialogContext();
  const Description = isMobile
    ? DrawerPrimitive.Description
    : DialogPrimitive.Description;

  return (
    <Description
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
ResponsiveDialogDescription.displayName = 'ResponsiveDialogDescription';

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogClose,
};
