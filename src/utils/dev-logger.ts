export const devLogger = (message: unknown, error: boolean = false) => {
  if (process.env.NODE_ENV === 'development') {
    if (error) console.error(message);
    else console.log(message);
  }
};
