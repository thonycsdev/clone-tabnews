import user from "models/user";
import password from "models/password";
import {UnauthorizedError} from "infra/errors"

async function getAuthenticatedUser(data){
    const storedUser = await user.findOneByEmail(data.email);
    const correctPasswordMatch = await password.compare(data.password, storedUser.password);
    if(!correctPasswordMatch){
       throw new UnauthorizedError({
      message: "Senha não confere.",
      action: "Verifique se o dado está correto."
    })
    }
    return storedUser
}

const authentication = {getAuthenticatedUser}
export default authentication;