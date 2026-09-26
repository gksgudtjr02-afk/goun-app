import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

export async function generateMetadata({ params }) {
  const { handle } = await params;
  return { title: `@${handle} | 고운` };
}

const TYPE_LABEL = { lip: "입술", eye: "눈", blush: "볼터치", base: "베이스", skin: "스킨케어" };

export default async function CreatorPage({ params }) {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("creator_pages")
    .select("user_id, handle, bio")
    .eq("handle", handle)
    .maybeSingle();

  if (!page) notFound();

  const { data: picks } = await supabase
    .from("creator_picks")
    .select("brand, name, price, color, type")
    .eq("user_id", page.user_id)
    .order("created_at", { ascending: true });

  return (
    <div className="creator-page">
      <header className="creator-page-header">
        <span className="creator-page-mark">고운</span>
        <div className="creator-page-avatar" />
        <h1>@{page.handle}</h1>
        {page.bio && <p className="creator-page-bio">{page.bio}</p>}
      </header>

      <div className="creator-page-list">
        {(picks || []).length === 0 && (
          <p className="creator-page-empty">아직 추천한 제품이 없어요</p>
        )}
        {(picks || []).map((p) => (
          <a
            key={p.name}
            className="creator-page-card"
            href={`https://www.coupang.com/np/search?q=${encodeURIComponent(p.name)}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            <span
              className="creator-page-swatch"
              style={{ background: `linear-gradient(145deg, ${p.color}, ${p.color}cc)` }}
            />
            <span className="creator-page-info">
              <span className="creator-page-brand">{p.brand}</span>
              <span className="creator-page-name">{p.name}</span>
              <span className="creator-page-tag">{TYPE_LABEL[p.type] || p.type}</span>
            </span>
            <span className="creator-page-buy">쿠팡에서 보기</span>
          </a>
        ))}
      </div>

      <footer className="creator-page-footer">
        <a href="/">고운(GOUN)에서 나만의 추천 페이지 만들기 →</a>
        <p className="creator-page-disclosure">이 페이지의 구매 링크는 제휴 마케팅을 포함할 수 있어요.</p>
      </footer>
    </div>
  );
}
