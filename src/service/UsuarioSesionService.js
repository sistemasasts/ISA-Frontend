import { getDecodedToken } from '.././config/auth/credentialConfiguration'
import * as _ from "lodash";

export function tieneRol(rol){

    const token = getDecodedToken();

    return _.includes(token.authorities, rol);
}