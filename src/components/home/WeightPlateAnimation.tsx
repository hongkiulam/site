import styles from './WeightPlateAnimation.module.css';

interface PlateGroupProps {
  verticalTranslate: string;
  plateFillColor?: string;
  trimFillColor?: string;
  holeColor?: string;
  strokeColor?: string;
  textColor?: string;
  className?: string;
  opacity?: number;
}

const PlateGroup = ({
  verticalTranslate,
  plateFillColor,
  trimFillColor,
  holeColor,
  strokeColor,
  textColor,
  className,
  opacity
}: PlateGroupProps) => {
  return (
    <g
      className={className}
      style={
        {
          '--vertical-translate': verticalTranslate,
          '--plate-fill-color': plateFillColor,
          '--trim-fill-color': trimFillColor,
          '--hole-color': holeColor,
          '--stroke-color': strokeColor,
          '--text-color': textColor,
          opacity
        } as React.CSSProperties
      }
    >
      <path
        d="M150 24C191.082 24 228.184 35.1044 254.957 52.9531C281.744 70.8112 298 95.2626 298 122C298 148.737 281.744 173.189 254.957 191.047C228.184 208.896 191.082 220 150 220C108.918 220 71.8161 208.896 45.043 191.047C18.256 173.189 2 148.737 2 122C2 95.2626 18.256 70.8112 45.043 52.9531C71.8161 35.1044 108.918 24 150 24Z"
        fill="var(--plate-fill-color)"
        stroke="var(--stroke-color)"
        stroke-width="2"
      />
      <path
        d="M150 2C191.082 2 228.184 13.1044 254.957 30.9531C281.744 48.8112 298 73.2626 298 100C298 126.737 281.744 151.189 254.957 169.047C228.184 186.896 191.082 198 150 198C108.918 198 71.8161 186.896 45.043 169.047C18.256 151.189 2 126.737 2 100C2 73.2626 18.256 48.8112 45.043 30.9531C71.8161 13.1044 108.918 2 150 2Z"
        fill="var(--plate-fill-color)"
        stroke="var(--stroke-color)"
        stroke-width="2"
      />
      <path
        d="M150 10.5C187.194 10.5 220.844 20.5516 245.182 36.7764C269.522 53.0036 284.5 75.3664 284.5 100C284.5 124.634 269.522 146.996 245.182 163.224C220.844 179.448 187.194 189.5 150 189.5C112.806 189.5 79.1556 179.448 54.8184 163.224C30.4776 146.996 15.5 124.634 15.5 100C15.5 75.3664 30.4776 53.0036 54.8184 36.7764C79.1556 20.5516 112.806 10.5 150 10.5Z"
        fill="var(--plate-fill-color)"
        stroke="var(--stroke-color)"
      />
      <path
        d="M150 70.5C162.341 70.5 173.491 73.8362 181.542 79.2031C189.596 84.5725 194.5 91.9349 194.5 100C194.5 108.065 189.596 115.428 181.542 120.797C173.491 126.164 162.341 129.5 150 129.5C137.659 129.5 126.509 126.164 118.458 120.797C110.404 115.428 105.5 108.065 105.5 100C105.5 91.9349 110.404 84.5725 118.458 79.2031C126.509 73.8362 137.659 70.5 150 70.5Z"
        fill="var(--trim-fill-color)"
        stroke="var(--stroke-color)"
      />
      <path
        d="M149.5 86C155.543 86 160.97 87.635 164.855 90.2256C168.748 92.8208 171 96.2963 171 100C171 103.704 168.748 107.179 164.855 109.774C160.97 112.365 155.543 114 149.5 114C143.457 114 138.03 112.365 134.145 109.774C130.252 107.179 128 103.704 128 100C128 96.2963 130.252 92.8208 134.145 90.2256C138.03 87.635 143.457 86 149.5 86Z"
        fill="var(--hole-color)"
        stroke="var(--stroke-color)"
        stroke-width="2"
      />
      <path
        d="M33.1778 93C33.1778 93 33.1778 87 42.5119 87C51.846 87 51.846 93 51.846 93C51.8531 94.6683 50.4969 96.181 49.692 97C48.887 97.819 46.1019 100 46.1019 100C46.1019 100 30.3057 111 31.0238 111C31.7418 111 54 111 54 111"
        stroke="var(--text-color)"
        stroke-width="6"
      />
      <path
        d="M84 99.5C84 88.5625 77.4286 87 72.5 87C67.5714 87 61 88.5625 61 99.5C61 110.438 67.5714 112 72.5 112C77.4286 112 84 110.438 84 99.5Z"
        stroke="var(--text-color)"
        stroke-width="6"
      />
      <line x1="2" y1="100" x2="2" y2="122" stroke="var(--stroke-color)" stroke-width="2" />
      <line x1="298" y1="100" x2="298" y2="122" stroke="var(--stroke-color)" stroke-width="2" />
    </g>
  );
};

const WeightPlateAnimation = () => {
  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.plate_wrapper}
    >
      {/* Bottom plate (darkest shade) */}
      <PlateGroup
        verticalTranslate="150px"
        plateFillColor="#a7cca7"
        strokeColor="darkgreen"
        className={styles.plate}
        opacity={0.6}
      />

      {/* Second plate (dark shade) */}
      <PlateGroup
        verticalTranslate="127px"
        plateFillColor="#f1c980"
        strokeColor="orange"
        className={styles.plate}
        opacity={0.6}
      />

      {/* Third plate (medium shade) */}
      <PlateGroup
        verticalTranslate="104px"
        plateFillColor="#a0b2e8"
        strokeColor="royalblue"
        className={styles.plate}
        opacity={0.8}
      />

      {/* Top plate (brightest/original color) */}
      <PlateGroup
        verticalTranslate="81px"
        plateFillColor="#d05a5a"
        trimFillColor="#EDEDED"
        holeColor="#9f9797"
        strokeColor="black"
        textColor="white"
        className={`${styles.plate} ${styles.bounce}`}
      />
    </svg>
  );
};

export default WeightPlateAnimation;
