import express from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const prisma = new PrismaClient()
const router = express.Router()

//Cadastro Feito
router.post('/cadastro', async (req, res) => {
    try{
    const user = req.body

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password, salt)

    const userDB = await prisma.user.create({
        data: {
            email: user.email, 
            name: user.name, 
            password: hashPassword,
        },
    })
    res.status(201).json(userDB)
    } catch (err) {
        res.status(500).json({message: "Erro no servidor"})
    }
})

//Login

router.post('/login', async (req, res) => {
    try {    
    const userInfo = req.body
    
    //Buscando usuário
    const user = await prisma.user.findUnique({     
        where: { email: userInfo.email },
        })

        //Verificando
        if(!user){
            return res.status(404).json({message: 'Usuário não encontrado'})
        }

        // Comparando
        const isMatch = await bcrypt.compare(userInfo.password, user.password)

        if(!isMatch){
        return res.status(401).json({message: 'Senha inválida'})
}
        //Gerando o token JWT
        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '5m'})

        res.status(200).json(token)
    } catch(err){
        res.status(500).json({message: "Erro no servidor"})
    }
    
})



export default router

//bugmaer
//98143360
//mongodb+srv://<db_username>:<db_password>@cluster0.rr3f2my.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0