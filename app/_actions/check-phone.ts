import { db } from './../_lib/prisma';

export const chekPhone = async (userId: string) => {
//TODO: DELETAR ESSA FUNÇÃO
    const user = await db.user.findUnique({
    where: { id: userId },
    select: { phone: true } 
    });
    if (!user || !user.phone) {
        console.log("não tem celular ");
      } return user;
    
    };
