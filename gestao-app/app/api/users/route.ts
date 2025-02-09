import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import User from '@/app/models/User';


export async function GET(req: Request) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const user = await User.findById(id);
            if (!user) {
                return NextResponse.json({ ok: false, message: "Usuário não encontrado" }, { status: 404 });
            }
            return NextResponse.json(user, { status: 200 });
        } else {
            const users = await User.find();
            return NextResponse.json(users, { status: 200 });
        }
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}


export async function POST(req: Request) {
    await connectDB();

    try {
        const body = await req.json();
        const { name, phone, cpf, email, password, role, imageUrl } = body;

        if (!name || !phone || !cpf || !email || !password) {
            return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
        }

        const existingUser = await User.findOne({ $or: [{ cpf }, { email }] });
        if (existingUser) {
            return NextResponse.json(
                { error: "CPF ou Email já estão cadastrados" },
                { status: 400 }
            );
        }

        const newUser = new User({
            name,
            phone,
            cpf,
            email,
            password,
            role: role || "USER",
            imageUrl,
        });

        await newUser.save();
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        );
    }
}
