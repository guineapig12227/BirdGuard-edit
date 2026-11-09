"use client";

import Image from "next/image";
import {
  Bell,
  CreditCard,
  Pencil,
  Plus,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import styles from "./my-page.module.css";

type Props = {
  onAnalyze: () => void;
};

type TabId = "payment" | "orders" | "settings";

const tabs = [
  { id: "payment", label: "결제 수단", icon: CreditCard },
  { id: "orders", label: "구매 내역", icon: ShoppingBag },
  { id: "settings", label: "환경설정", icon: Settings },
] as const;

export function MyPage({ onAnalyze }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("payment");
  const [notice, setNotice] = useState("");
  const [orderNotice, setOrderNotice] = useState(false);
  const [eventNotice, setEventNotice] = useState(false);

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // 실제 회원 정보 연동 전 사용하는 체험용 프로필입니다.
  const nickname = "버디";

  function changeTab(id: TabId) {
    setActiveTab(id);
    setNotice("");
  }

  // 키보드에서도 방향키 / Home / End로 탭을 이동할 수 있습니다.
  function handleTabKey(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;

    if (event.key === "ArrowRight") {
      next = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      next = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    changeTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className={styles.page} aria-labelledby="mypage-title">
      <div className={styles.heading}>
        <h1 id="mypage-title">마이페이지</h1>
        <p>나의 정보와 구매 내역을 한곳에서 관리하세요.</p>
      </div>

      {/* 프로필 */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          <Image
            src="/mascot/birdguard-front.png"
            alt={`${nickname}님의 기본 프로필 사진`}
            width={80}
            height={80}
            unoptimized
          />
        </div>

        <div className={styles.profileInfo}>
          <span className={styles.profileLabel}>체험용 프로필</span>

          <h2>
            {nickname}
            <span>님</span>
          </h2>

          <p>새와 함께하는 안전한 공간을 만들어요.</p>
        </div>

        <button
          type="button"
          className={styles.editButton}
          onClick={() =>
            setNotice(
              "프로필 수정은 준비 중이에요. 현재는 기본 프로필이 표시됩니다.",
            )
          }
        >
          <Pencil size={14} aria-hidden="true" />
          프로필 수정
        </button>
      </div>

      {/* 결제 수단 / 구매 내역 / 환경설정 */}
      <div className={styles.menuCard}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="마이페이지 메뉴"
        >
          {tabs.map(({ id, label, icon: Icon }, index) => (
            <button
              key={id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`mypage-tab-${id}`}
              aria-controls={`mypage-panel-${id}`}
              aria-selected={activeTab === id}
              tabIndex={activeTab === id ? 0 : -1}
              className={styles.tab}
              onClick={() => changeTab(id)}
              onKeyDown={(event) => handleTabKey(event, index)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* 결제 수단 */}
        <section
          id="mypage-panel-payment"
          role="tabpanel"
          aria-labelledby="mypage-tab-payment"
          hidden={activeTab !== "payment"}
          tabIndex={0}
          className={styles.panel}
        >
          <div className={styles.panelHeading}>
            <h2>내 결제 수단</h2>
            <span>0개</span>
          </div>

          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <CreditCard size={28} aria-hidden="true" />
            </span>

            <h3>등록된 결제 수단이 없어요</h3>

            <p>
              맞춤 필름 구매에 사용할 결제 수단을
              <br />
              이곳에서 관리할 수 있어요.
            </p>

            <button
              type="button"
              className={styles.actionButton}
              onClick={() =>
                setNotice(
                  "결제 수단 등록은 준비 중이에요. 실제 결제나 카드 정보 저장은 이루어지지 않습니다.",
                )
              }
            >
              <Plus size={17} aria-hidden="true" />
              결제 수단 등록
            </button>
          </div>
        </section>

        {/* 구매 내역 */}
        <section
          id="mypage-panel-orders"
          role="tabpanel"
          aria-labelledby="mypage-tab-orders"
          hidden={activeTab !== "orders"}
          tabIndex={0}
          className={styles.panel}
        >
          <div className={styles.panelHeading}>
            <h2>나의 구매 내역</h2>
            <span>0건</span>
          </div>

          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <ShoppingBag size={28} aria-hidden="true" />
            </span>

            <h3>아직 구매 내역이 없어요</h3>

            <p>
              건물 사진을 분석하고
              <br />
              우리 공간에 어울리는 디자인을 찾아보세요.
            </p>

            <button
              type="button"
              className={styles.actionButton}
              onClick={onAnalyze}
            >
              맞춤 디자인 찾아보기
            </button>
          </div>
        </section>

        {/* 환경설정 */}
        <section
          id="mypage-panel-settings"
          role="tabpanel"
          aria-labelledby="mypage-tab-settings"
          hidden={activeTab !== "settings"}
          tabIndex={0}
          className={styles.panel}
        >
          <div className={styles.panelHeading}>
            <h2>알림 설정</h2>
            <Bell size={18} aria-hidden="true" />
          </div>

          <div className={styles.settingRow}>
            <div>
              <h3 id="mypage-order-label">주문·배송 알림</h3>
              <p id="mypage-order-description">
                주문 상태와 배송 소식을 받아요.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={orderNotice}
              aria-labelledby="mypage-order-label"
              aria-describedby="mypage-order-description"
              className={styles.switch}
              onClick={() => setOrderNotice((value) => !value)}
            >
              <span />
            </button>
          </div>

          <div className={styles.settingRow}>
            <div>
              <h3 id="mypage-event-label">이벤트·혜택 알림</h3>
              <p id="mypage-event-description">
                새로운 디자인과 할인 소식을 받아요.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={eventNotice}
              aria-labelledby="mypage-event-label"
              aria-describedby="mypage-event-description"
              className={styles.switch}
              onClick={() => setEventNotice((value) => !value)}
            >
              <span />
            </button>
          </div>

          <p className={styles.settingNote}>
            체험용 설정으로 실제 알림은 발송되지 않습니다.
            하단의 다른 메뉴로 이동하거나 새로고침하면 초기화됩니다.
          </p>

          <div className={styles.versionRow}>
            <span>앱 버전</span>
            <span>0.1.0</span>
          </div>
        </section>
      </div>

      <div className={styles.notice} role="status" aria-live="polite">
        {notice}
      </div>

      <p className={styles.demoNote}>
        미리보기 화면입니다. 회원 정보와 실제 결제·주문 내역은 연결되어
        있지 않아요.
      </p>
    </section>
  );
}