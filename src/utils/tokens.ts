import jwt from "jsonwebtoken";

const accessLifetime = "1m";
const RefreshLifetime = "30d"

interface SecretKeys {
    accessSecret: string,
    refreshSecret: string
}

export const generateTokens = async (secretKeys: SecretKeys, details: any) => {
    try {
        const payload = details;
        const accessToken = jwt.sign(
            payload,
            secretKeys.accessSecret,
            { expiresIn: accessLifetime }
        );
        const refreshToken = jwt.sign(
            payload,
            secretKeys.refreshSecret,
            { expiresIn: RefreshLifetime }
        );

        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

export const refreshAccessToken = async (details: any, secretKeys: SecretKeys, refreshToken: string) => {
    const { refreshSecret } = secretKeys;
    jwt.verify(refreshToken, refreshSecret, (err, user) => {
        console.log(user)
        if(err) {
            console.log(err);
            return err
        }
        const newAccessToken = jwt.sign({user}, secretKeys.accessSecret, { expiresIn: accessLifetime });
        return { accessToken: newAccessToken };
    });
}



export const verifyRefreshToken = async (secretKey: string, refreshToken: string) => {
    const verify = jwt.verify(refreshToken, secretKey)
    return verify;
};