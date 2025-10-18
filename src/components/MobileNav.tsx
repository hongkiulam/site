import { useRef, useState } from 'react';
import S from './MobileNav.module.css';
import MobileNavPageWipe from './MobileNavPageWipe';
import { X, Menu, Home } from 'lucide-react';

const LabelledIconButton = ({
  onClick,
  Icon,
  label
}: {
  onClick: () => void;
  Icon: React.ComponentType;
  label: string;
}) => {
  return (
    <div className="group flex items-end flex-col justify-center">
      <button
        className="relative text-muted-foreground text-sm cursor-pointer overflow-clip h-auto max-h-0 focus:max-h-6 group-hover:max-h-6 transition-all"
        onClick={onClick}
        aria-label={label}
      >
        <span className="absolute">{label}</span>
        &nbsp;
        {/*<span className="opacity-0">{label}</span>*/}
      </button>
      <button
        tabIndex={-1}
        onClick={onClick}
        aria-label="Open Navigation"
        className="-mr-1 cursor-pointer"
      >
        <Icon />
      </button>
    </div>
  );
};

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const showModal = () => {
    if (!dialogRef.current) return;
    dialogRef.current.showModal();
    setOpen(true);
  };

  const hideModal = () => {
    if (!dialogRef.current) return;
    dialogRef.current.close();
    setOpen(false);
  };

  return (
    <>
      <menu className="flex items-center flex-row justify-end pl-20 gap-2">
        <button className="-mr-1 cursor-pointer" onClick={showModal}>
          <Menu />
        </button>
        <dialog
          ref={dialogRef}
          onClose={hideModal}
          className={`${S['mobile-nav']} w-full min-w-full left-full min-h-screen bg-transparent h-screen fixed top-0 text-muted-background
        `}
        >
          <form
            className="h-[90px] flex flex-col justify-center items-start px-12 py-4 max-w-[1440px] mx-auto max-sm:px-6"
            method="dialog"
          >
            <menu className="flex items-start flex-col justify-center">
              <button
                onClick={hideModal}
                className="text-muted-background text-sm cursor-pointer"
                tabIndex={-1}
                id="close-navigation-label"
              >
                Close Menu
              </button>
              <button
                autoFocus
                formMethod="dialog"
                aria-labelledby="close-navigation-label"
                className="-ml-1 cursor-pointer pr-20"
              >
                <X />
              </button>
            </menu>
          </form>
          <div className="clamped">
            <ul className="flex flex-col gap-3">
              <li>
                <h2>
                  <a href="/">Home</a>
                </h2>
              </li>
              <li>
                <h2>Projects</h2>
              </li>
              <li>
                <h2>
                  <a href="/photos">Photography</a>
                </h2>
              </li>
              <li>
                <h2>
                  <a href="/experiments">Lab/ Experiments</a>
                </h2>
              </li>
              <li>
                <h2>Spoon Carving</h2>
              </li>
            </ul>
          </div>
        </dialog>
        <MobileNavPageWipe isOpen={open} />
      </menu>
    </>
  );
};

export default MobileNav;
