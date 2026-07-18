import {
  useState,
  useEffect,
  isValidElement,
  type CSSProperties,
  type ReactNode,
} from "react";

type BannerVariant = "info" | "success" | "warning" | "error";

type NotificationBannerProps = {
  variant?: BannerVariant;
  message?: string;
  children?: ReactNode;
  onDismiss?: () => void;
};

function getTextFromNode(node: ReactNode): string {
  // Base cases: primitive values
  if (node === null || node === undefined) {
    return "";
  }
  if (
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "boolean"
  ) {
    return node.toString();
  }
  // Handle arrays or React.Children structures
  if (Array.isArray(node)) {
    return node.map(getTextFromNode).join("");
  }
  // If it's a valid React element, unpack its children recursively
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextFromNode(node.props.children);
  }
  return "";
}

// The banner has four variants: info, success, warning, and error
// It displays a message passed in as a prop
// It can optionally be dismissible — when dismissed, it disappears
// The dismiss button should be accessible
// The banner should be announced appropriately to screen reader users when it appears
// color/symbol differentiation on variants
// banner should be rendered into the DOM dynamically (injected after user action)
// when injected dynamically, a plain aria-live region may not announce it reliably

const variants: Record<
  BannerVariant,
  { backgroundColor: string; symbol: string; color: string }
> = {
  info: { backgroundColor: "blue", symbol: "i", color: "white" },
  success: { backgroundColor: "green", symbol: "$", color: "white" },
  warning: { backgroundColor: "orange", symbol: "^", color: "black" },
  error: { backgroundColor: "red", symbol: "!", color: "white" },
};

const srOnly: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const NotificationBanner = ({
  variant = "info",
  message,
  children,
  onDismiss,
}: NotificationBannerProps) => {
  const [announcement, setAnnouncement] = useState("");
  const content = children ? getTextFromNode(children) : message ? message : "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncement(`${variant}: ${content}`);
    }, 100);
    return () => clearTimeout(timer);
    // Announce once on mount when the banner is injected dynamically
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (children && message) {
    console.warn(
      "When both children and message are provided, children gets priority.",
    );
  }

  const { backgroundColor, symbol, color } = variants[variant];

  return (
    <div
      style={{
        backgroundColor,
        color,
        padding: 10,
        marginBottom: 10,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <span style={srOnly} role="status" aria-atomic="true">
          {announcement}
        </span>
        <span aria-hidden={true} style={{ marginRight: 10 }}>
          ({symbol})
        </span>
        <span aria-hidden={true}>{content}</span>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss notification">
          x
        </button>
      )}
    </div>
  );
};

const App = () => {
  const [showBanner, setShowBanner] = useState(false);

  return (
    <div>
      {showBanner && (
        <NotificationBanner
          variant="info"
          message="don't display this"
          onDismiss={() => setShowBanner(false)}
        >
          <p>Banner Content</p>
        </NotificationBanner>
      )}
      <button onClick={() => setShowBanner(true)}>Show banner</button>
    </div>
  );
};

export default App;
