import React from "react";

interface LogoProps {
  width?: number | string;
  height?: number | string;
  variant?: "gradient" | "solid" | "white";
  className?: string;
  iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  width = "100%",
  height = "100%",
  variant = "gradient",
  className = "",
  iconOnly = false,
}) => {
  const iconColor =
    variant === "white"
      ? "#ffffff"
      : variant === "solid"
      ? "#FF4D1C"
      : "url(#iconGrad)";

  const textColor =
    variant === "white"
      ? "#ffffff"
      : variant === "solid"
      ? "#FF4D1C"
      : "url(#textGrad)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconOnly ? "330 300 480 310" : "0 0 1000 300"}
      width={width}
      height={height}
      className={className}
      aria-label="Hash Resume Logo"
      role="img"
      id="app-logo"
    >
      <defs>
        <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d2d" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      {/* Slashes Group - Scaled and moved to left */}
      <g fill={iconColor} transform={iconOnly ? "" : "translate(-160, -100) scale(0.5)"}>
        <path d="M 437.5 306 L 534.5 306 L 535 308.5 L 436 605 L 337.5 605 L 337 603.5 L 435 309.5 L 437.5 306 Z" />
        <path d="M 584 306 L 682.5 306 L 683 308.5 L 584 605 L 485.5 605 L 485 603.5 L 584 306 Z" />
        <path d="M 728 383 L 802 383.5 L 777 458.5 L 775.5 460 L 759.5 448 L 757.5 448 L 707 483 L 710.5 488 L 756 521.5 L 728 605 L 655.5 605 L 655 602.5 L 728 383 Z" />
      </g>

      {!iconOnly && (
        <g fill={textColor} transform="translate(60, -510)">
          {/* Brand Text: Hash Resume */}
          <path d="M 226 643 L 211 648 L 209 649 L 209 735 L 228 735 L 228 697 L 260 697 L 260 735 L 280 735 L 280 735 L 280 643 L 262 648 L 260 649 L 260 681 L 234 681 L 229 695 L 228 695 L 228 644 L 226 643 Z" />
          <path d="M 314 675 L 303 677 L 300 680 L 298 692 L 308 689 Q 318 687 325 690 Q 329 693 328 700 L 325 699 Q 306 697 L 298 704 L 293 714 L 293 721 L 298 731 Q 306 738 324 736 L 329 728 L 329 735 L 331 736 L 346 736 L 346 698 L 344 689 L 342 686 Q 338 680 332 678 L 326 676 L 314 675 Z" />
          <path d="M 371 675 L 359 680 L 352 690 Q 350 700 355 705 Q 361 711 371 714 Q 374 715 373 722 L 369 724 L 352 723 L 354 736 L 357 737 Q 374 739 384 733 Q 390 729 391 721 Q 392 713 389 710 Q 382 700 370 696 L 369 690 L 372 689 L 386 689 L 387 690 L 390 690 L 390 677 L 380 675 L 371 675 Z" />
          <path d="M 397 655 L 397 736 L 415 736 L 415 690 L 427 690 L 429 691 L 432 696 L 433 701 L 433 736 L 451 736 L 451 697 L 447 687 L 439 679 L 422 676 L 417 686 L 415 687 L 415 655 L 397 655 Z" />
          <path d="M 486 643 L 486 736 L 487 736 L 503 736 L 504 690 L 531 736 L 552 736 L 533 707 L 532 702 L 539 699 Q 544 695 547 688 L 549 677 L 547 661 L 541 650 L 527 643 L 486 643 Z" />
          <path d="M 587 675 Q 585 678 579 676 L 570 680 L 562 689 L 558 705 L 559 718 L 564 728 L 569 732 L 583 737 L 602 737 L 611 735 L 613 721 L 600 724 Q 585 726 579 721 L 575 713 L 576 704 L 580 711 L 585 715 L 616 715 L 616 699 L 611 687 Q 604 676 587 675 Z" />
          <path d="M 642 675 L 630 680 L 623 690 Q 621 700 626 705 Q 632 711 642 714 Q 645 715 644 722 L 640 724 L 623 723 L 625 736 L 628 737 Q 645 739 655 733 Q 661 729 662 721 Q 663 713 660 710 Q 653 700 641 696 L 640 690 L 643 689 L 657 689 L 658 690 L 661 690 L 661 677 L 651 675 L 642 675 Z" />
          <path d="M 668 675 L 668 714 L 670 722 L 674 729 Q 681 738 700 736 L 705 728 L 706 736 L 722 736 L 722 736 L 722 675 L 704 675 L 704 723 Q 695 725 691 721 L 687 716 L 687 677 L 686 675 L 668 675 Z" />
          <path d="M 752 675 L 746 686 L 745 676 L 730 680 L 728 682 L 728 736 L 745 736 L 745 689 L 755 689 L 758 691 L 761 698 L 761 736 L 780 736 L 780 700 L 778 691 L 778 689 Q 786 687 790 690 L 794 697 L 794 736 L 813 736 L 813 698 L 808 685 L 799 677 L 783 675 L 777 687 Q 774 688 775 686 Q 771 680 764 677 L 752 675 Z" />
          <path d="M 848 675 Q 846 678 840 676 L 831 680 L 823 689 L 819 705 L 820 718 L 825 728 L 830 732 L 844 737 L 863 737 L 872 735 L 874 721 L 861 724 Q 846 726 840 721 L 836 713 L 837 704 L 841 711 L 846 715 L 877 715 L 877 699 L 872 687 Q 865 676 848 675 Z" />
        </g>
      )}
    </svg>
  );
};

export default Logo;
