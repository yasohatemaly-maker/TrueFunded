/* ================= TRUEFUNDED ELITE – FULL NEXT.JS PRODUCTION STRUCTURE ================= */

/* ================= 1️⃣ PROJECT STRUCTURE (Next.js App Router) =================

truefunded/
 ├── app/
 │   ├── layout.tsx
 │   ├── page.tsx (Home)
 │   ├── pricing/page.tsx
 │   ├── dashboard/page.tsx
 │   ├── login/page.tsx
 │   ├── admin/page.tsx
 │   ├── api/
 │   │    ├── stripe/route.ts
 │   │    ├── payout/route.ts
 │   │    ├── mt5/route.ts
 ├── components/
 │   ├── Navbar.tsx
 │   ├── ParticleBackground.tsx
 │   ├── PricingCard.tsx
 │   ├── DashboardChart.tsx
 │   ├── AdminTable.tsx
 ├── lib/
 │   ├── supabase.ts
 │   ├── stripe.ts
 ├── middleware.ts
 ├── .env.local

==================================================================== */

/* ================= 2️⃣ PARTICLE BACKGROUND (Floating Lights) ================= */

// components/ParticleBackground.tsx
"use client";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticleBackground() {
  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  return (
    <Particles
      init={particlesInit}
      options={{
        background: { color: "#000000" },
        particles: {
          number: { value: 60 },
          color: { value: "#9333ea" },
          links: { enable: true, color: "#6d28d9" },
          move: { enable: true, speed: 1 },
          opacity: { value: 0.4 },
        },
      }}
    />
  );
}

/* ================= 3️⃣ SUPABASE DATABASE SETUP ================= */

// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* Database Tables:

users
- id
- email
- role (trader/admin)
- account_size
- balance
- profit

payout_requests
- id
- user_id
- amount
- status (pending/approved/rejected)

*/

/* ================= 4️⃣ STRIPE CHECKOUT (API ROUTE) ================= */

// app/api/stripe/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { amount } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "TrueFunded Challenge" },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}

/* ================= 5️⃣ MT5 CONNECTION (Bridge API Example) ================= */

// app/api/mt5/route.ts
export async function POST(req: Request) {
  const { login, password } = await req.json();

  // Connect to MT5 Manager API or third-party bridge
  // Validate trader account & return balance data

  return Response.json({ balance: 100000, profit: 1250 });
}

/* ================= 6️⃣ AUTOMATED PAYOUT REQUEST SYSTEM ================= */

// app/api/payout/route.ts
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { user_id, amount } = await req.json();

  await supabase.from("payout_requests").insert({
    user_id,
    amount,
    status: "pending",
  });

  return Response.json({ success: true });
}

/* ================= 7️⃣ ADMIN PANEL ================= */

// app/admin/page.tsx
import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
  const { data: users } = await supabase.from("users").select("*");

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-3xl mb-6">Admin Panel</h1>
      <table className="w-full border border-purple-500/30">
        <thead>
          <tr>
            <th>Email</th>
            <th>Balance</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: any) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.balance}</td>
              <td>{user.profit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= 8️⃣ UAE LEGAL STRUCTURE GUIDE =================

To legally operate TrueFunded in UAE:

1️⃣ Company Setup:
   - Free Zone: IFZA / SHAMS / Meydan (low cost option)
   - Activity: "Online Trading Services" or "Financial Consultancy"

2️⃣ Banking:
   - Open corporate account (Wio / Mashreq NeoBiz)

3️⃣ Payment Processing:
   - Stripe Atlas or UAE Stripe entity

4️⃣ Compliance:
   - Clear Risk Disclosure
   - Shariah compliance statement
   - Terms of Service

5️⃣ If offering real capital trading:
   - You may require SCA approval
   - Consider operating as "evaluation service" model only

==================================================================== */
