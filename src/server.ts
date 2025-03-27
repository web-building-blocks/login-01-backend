import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabase/client";
import authRoutes from "./routes/auth";

// ✅ 加载环境变量（必须写在前面）
dotenv.config();

// ✅ 创建 Express 实例
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 中间件
app.use(cors());
app.use(express.json());

// ✅ 掛载路由
app.use("/auth", authRoutes); // 会响应 POST /auth/signup 和 /auth/login

// ✅ 基础测试接口
app.get("/", (req: Request, res: Response): void => {
    res.send("Hello from Supabase backend");
});

// ✅ 查询当前所有 items（不鉴权版本）
app.get("/collections/item", async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from("items").select("*");

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
});

// ✅ 启动服务器
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
