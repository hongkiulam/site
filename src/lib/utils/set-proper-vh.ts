const customViewportCorrectionVariable = 'pvh';
let prevClientHeight: number;

const setProperViewheight = (): void => {
  const doc = document.documentElement;
  const clientHeight = doc.clientHeight;
  if (clientHeight === prevClientHeight) {
    requestAnimationFrame(setProperViewheight);
    return;
  }

  doc.style.setProperty(`--100${customViewportCorrectionVariable}`, clientHeight + 'px');
  doc.style.setProperty(`--${customViewportCorrectionVariable}`, clientHeight * 0.01 + 'px');
  prevClientHeight = clientHeight;

  requestAnimationFrame(setProperViewheight);
};

export default setProperViewheight;
