export function InfoLog(...argu) {
  if (process.env.DEBUG) {
    // eslint-disable-next-line
    console.log(...argu);
  }
}

export function ErrorLog(...argu) {
  if (process.env.DEBUG) {
    // eslint-disable-next-line
    console.error(...argu);
  }
}

const Log = {
  Error: ErrorLog,
  Info: InfoLog,
};

export default Log;
