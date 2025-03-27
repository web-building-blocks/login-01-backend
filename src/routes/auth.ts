import express, { Request, Response } from "express";
import { supabase } from "../supabase/client";

const router = express.Router();

// ✅ 注册接口
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.status(200).json({ message: "Signup success", data });
});

// ✅ 登录接口
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.status(200).json({
        message: "Login success",
        access_token: data.session?.access_token,
    });
});


router.get("/user", async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Missing token" });
        return;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    }

    res.status(200).json({ email: user.email });
});

// ✅ 请求发送重置密码邮件
router.post("/reset-password", async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/update-password", // 用户点击邮件后的跳转页面（你要实现）
    });

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.status(200).json({ message: "Password reset email sent", data });
});


export default router;
