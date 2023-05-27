import { v4 as uuidv4 } from 'uuid';
export const getUUID = () => {

    if (!localStorage.getItem('UUID')) {
        return localStorage.setItem('UUID', uuidv4())
    }
    else {
        return localStorage.getItem('UUID')
    }
}