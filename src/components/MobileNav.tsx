import { useRef, useState } from "react";
import S from "./MobileNav.module.css";
import { animate } from "animejs";
import MobileNavPageWipe from "./MobileNavPageWipe";
import { Menu, X, ChevronLeft } from "lucide-react";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const showModal = () => {
    if (!dialogRef.current) return;
    dialogRef.current.showModal();
    setOpen(true);
    animate(dialogRef.current, {
      // opacity: 1,
      // duration: 200,
      // delay: 450,
      // x: { to: "-100%", duration: 0 },
    });
  };

  const hideModal = () => {
    if (!dialogRef.current) return;
    dialogRef.current.close();
    setOpen(false);
    // animate(dialogRef.current, {
    //   duration: 200,
    //   opacity: 0,
    //   x: { to: "0%", duration: 0, delay: 500 },
    // });
  };

  return (
    <>
      <button
        onClick={showModal}
        aria-label="Open Navigation"
        className="-mr-2 cursor-pointer"
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
          <div className="flex items-start flex-col justify-center">
            <small
              className="text-muted-background text-sm"
              id="close-navigation-label"
            >
              Close Navigation
            </small>
            <menu>
              <button
                autoFocus
                formMethod="dialog"
                aria-labelledby="close-navigation-label"
                className="-ml-1 cursor-pointer"
              >
                <X />
              </button>
            </menu>
          </div>
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
    </>
  );
};

export default MobileNav;
