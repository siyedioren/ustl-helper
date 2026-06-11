import "./index.scss";

import { Button, Text, View } from "@tarojs/components";

import type { HistoryItem } from "@/store";
import useStore from "@/store";
import { Toast } from "@/utils/toast";

const TYPE_LABEL: Record<HistoryItem["type"], string> = {
  website: "网址",
  life: "生活",
  news: "新闻",
  library: "图书",
};

function formatTime(ts: number) {
  const now = Date.now();
  const diff = now - ts;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "刚刚";
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)}小时前`;
  return `${Math.floor(diff / day)}天前`;
}

export default function HistoryIndex() {
  const history = useStore((state) => state.history);
  const clearHistory = useStore((state) => state.clearHistory);

  const handleClear = () => {
    clearHistory();
    Toast.info("历史记录已清空");
  };

  return (
    <View className="hist-page">
      <View className="hist-list">
        {history.length === 0 ? (
          <View className="hist-empty">
            <Text>暂无浏览历史</Text>
          </View>
        ) : (
          history.map((item, idx) => (
            <View key={idx} className="hist-item">
              <View className="hist-badge">{TYPE_LABEL[item.type]}</View>
              <View className="hist-main">
                <Text className="hist-title">{item.title}</Text>
                <Text className="hist-time">{formatTime(item.time)}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {history.length > 0 && (
        <Button className="hist-clear" size="mini" type="warn" onClick={handleClear}>
          清空历史
        </Button>
      )}
    </View>
  );
}
