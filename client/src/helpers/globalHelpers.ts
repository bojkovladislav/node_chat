export function generateRandomLoremParagraph() {
  const loremIpsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const loremArray = loremIpsum.split(" ");

  const randomWidth = Math.floor(Math.random() * 5) + 1;
  const randomParagraph = loremArray.slice(0, randomWidth).join(" ");

  return randomParagraph;
}

export function debounce(callback: (...args: any[]) => void, delay: number) {
  let timerId: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      callback(...args);

      timerId = null;
    }, delay);
  }
}
