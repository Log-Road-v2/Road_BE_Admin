import redis from '../config/redis';

export const getUserId = async (authorization: string | undefined) => {
  try {
    if (!authorization) {
      return {
        userId: null,
        err: '사용할 수 없는 토큰'
      };
    }
    const token = authorization.split(' ')[1];

    const userId = await redis.get(token);
    return {
      userId: Number(userId),
      err: null
    };
  } catch (err) {
    console.error(err);
    return {
      userId: null,
      err: err
    };
  }
};
