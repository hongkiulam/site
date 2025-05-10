import { useRef, useState } from "react";
import S from "./MobileNav.module.css";
import MobileNavPageWipe from "./MobileNavPageWipe";
import { X, ChevronLeft } from "lucide-react";

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
      <menu className="flex items-end flex-col justify-center">
        <button
          tabIndex={-1}
          className="text-muted-foreground text-sm cursor-pointer"
          onClick={showModal}
        >
          Open Navigation
        </button>
        <button
          onClick={showModal}
          aria-label="Open Navigation"
          className="-mr-2 cursor-pointer pl-20"
        >
          <ChevronLeft />
        </button>
        <dialog
          ref={dialogRef}
          onClose={hideModal}
          className={`${S["mobile-nav"]} w-full min-w-full left-full min-h-screen bg-transparent h-screen fixed top-0 text-muted-background
        `}
        >
          <form className="h-[90px] flex flex-col justify-center items-start px-12 py-4 max-w-[1440px] mx-auto max-sm:px-6">
            <menu className="flex items-start flex-col justify-center">
              <button
                onClick={hideModal}
                className="text-muted-background text-sm cursor-pointer"
                tabIndex={-1}
                id="close-navigation-label"
              >
                Close Navigation
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
                <h2>Lab/ Experiments</h2>
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
