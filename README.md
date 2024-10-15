# Các bước cài đặt

1. Clone template: `git clone ….`
2. Cài dependencies: `npm install`
3. Tạo file `.env` theo mẫu:

    ```cpp
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

    UPLOADTHING_SECRET=
    UPLOADTHING_APP_ID=

    NEXT_PUBLIC_TEACHER_ID=
    DATABASE_URL=
    DIRECT_URL=
    ```

    `NEXT_PUBLIC_TEACHER_ID` : Sau khi hoàn thành hết các bước và chạy được project, login bằng tài khoản Gmail của học sinh sau đó lấy `userId` trên Clerk để fill vào

4. Generate Prisma Model: `npx prisma genrate`
5. Chỉnh sửa các giá trị danh mục trong file `scripts/seed.ts` theo yêu cầu
6. Chạy script sinh danh mục: `ts-node scripts/seed.ts`
7. Chạy project: `npm run dev`
