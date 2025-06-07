import express from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

//LISTAR UM
router.get('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: id },
      
      select: {
        id: true,
        name: true,
        email: true,
        
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor!' });
  }
});

//LISTAR TODOS
router.get('/listar-usuarios', async (req,res) => {
    try{

        const users = await prisma.user.findMany({omit: { password: true }})

        res.status(200).json({message:"Usuários listados com sucesso!", users })

    } catch (err){
        console.log(err)
        res.status(500).json({message: "Falha no servidor!"})
    }
})


//EDITAR
router.put('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, email } = req.body

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                email
            }
        })

        res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: updatedUser })
    } catch (err) {
        console.log(err)
        console.error(err)
        res.status(500).json({ message: 'Erro no servidor!' })
    }
})


//DELETAR
router.delete('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params

        await prisma.user.delete({
            where: { id }
        })

        res.status(200).json({ message: 'Usuário deletado com sucesso!' })
    } catch (err) {
        console.log(err)
        console.error(err)
        res.status(500).json({ message: 'Erro no servidor!' })
    }
})


export default router