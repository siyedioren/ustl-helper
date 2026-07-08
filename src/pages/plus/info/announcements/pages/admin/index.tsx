import { Input, Picker, Switch, Text, Textarea, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import React, { useState } from "react";

import { Nav } from "@/utils/nav";
import { Toast } from "@/utils/toast";

import styles from "./index.module.scss";

interface Announcement {
  _id?: string;
  title: string;
  source: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  url: string;
  isTop: boolean;
  type: string;
}

const CATEGORIES = ["通知", "更新", "活动", "维护", "其他"];

const DEFAULT_FORM: Announcement = {
  title: "",
  source: "运营团队",
  category: "通知",
  date: "",
  summary: "",
  content: "",
  url: "",
  isTop: false,
  type: "announcement",
};

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forbiddenOpenid, setForbiddenOpenid] = useState("");
  const [form, setForm] = useState<Announcement>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [list, setList] = useState<Announcement[]>([]);

  useLoad(() => {
    const today = new Date().toISOString().slice(0, 10);
    setForm(prev => ({ ...prev, date: today }));

    Taro.cloud.callFunction({ name: "checkAdmin" })
      .then((res: any) => {
        if (res.result && res.result.openid) {
          setForbiddenOpenid(res.result.openid);
        }
        if (res.result && res.result.isAdmin) {
          setIsAdmin(true);
          fetchList();
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setLoading(false);
      });
  });

  const fetchList = () => {
    setLoading(true);
    Taro.cloud.callFunction({
      name: "newsFetch",
      data: { type: "announcement", category: "全部", skip: 0, limit: 50 },
    })
      .then((res: any) => {
        if (res.result && res.result.code === 0) {
          setList(res.result.data || []);
        }
      })
      .finally(() => setLoading(false));
  };

  const updateField = <K extends keyof Announcement>(key: K, value: Announcement[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      Toast.info("请输入标题");
      return;
    }
    if (!form.source.trim()) {
      Toast.info("请输入来源");
      return;
    }
    if (!form.summary.trim()) {
      Toast.info("请输入摘要");
      return;
    }

    const action = editingId ? "update" : "add";
    const data: any = { action };
    if (editingId) data.id = editingId;
    data.doc = { ...form };

    Taro.cloud.callFunction({ name: "postManage", data })
      .then((res: any) => {
        if (res.result && res.result.code === 0) {
          Toast.info(editingId ? "更新成功" : "发布成功");
          setForm({ ...DEFAULT_FORM, date: new Date().toISOString().slice(0, 10) });
          setEditingId(null);
          fetchList();
        } else {
          Toast.info(res.result?.message || "操作失败");
        }
      })
      .catch(() => Toast.info("操作失败"));
  };

  const handleEdit = (item: Announcement) => {
    setForm({
      title: item.title,
      source: item.source,
      category: item.category || "通知",
      date: item.date,
      summary: item.summary,
      content: item.content || "",
      url: item.url || "",
      isTop: !!item.isTop,
      type: item.type || "announcement",
    });
    setEditingId(item._id || null);
    Taro.pageScrollTo({ scrollTop: 0, duration: 300 });
  };

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: "确认删除",
      content: "删除后不可恢复，是否继续？",
    }).then((res: any) => {
      if (res.confirm) {
        Taro.cloud.callFunction({ name: "postManage", data: { action: "delete", id } })
          .then((res2: any) => {
            if (res2.result && res2.result.code === 0) {
              Toast.info("删除成功");
              if (editingId === id) {
                setForm({ ...DEFAULT_FORM, date: new Date().toISOString().slice(0, 10) });
                setEditingId(null);
              }
              fetchList();
            } else {
              Toast.info(res2.result?.message || "删除失败");
            }
          })
          .catch(() => Toast.info("删除失败"));
      }
    });
  };

  const handleCancel = () => {
    setForm({ ...DEFAULT_FORM, date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
  };

  if (!isAdmin) {
    return (
      <View className={styles.forbidden}>
        {loading ? (
          <Text>权限校验中...</Text>
        ) : (
          <View className={styles.forbiddenContent}>
            <Text className={styles.forbiddenTitle}>暂无权限访问该页面</Text>
            {forbiddenOpenid && (
              <Text className={styles.forbiddenOpenid} selectable>
                你的 openid：{forbiddenOpenid}
              </Text>
            )}
            <Text className={styles.forbiddenTip}>如需成为管理员，请将 openid 提供给开发者。</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className={styles.adminPage}>
      <View className={styles.formCard}>
        <View className={styles.sectionTitle}>{editingId ? "编辑公告" : "发布公告"}</View>

        <View className={styles.formItem}>
          <Text className={styles.label}>标题</Text>
          <Input
            className={styles.input}
            value={form.title}
            onInput={e => updateField("title", e.detail.value)}
            placeholder="请输入公告标题"
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>来源</Text>
          <Input
            className={styles.input}
            value={form.source}
            onInput={e => updateField("source", e.detail.value)}
            placeholder="如：运营团队、教务处"
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>分类</Text>
          <Picker
            mode="selector"
            range={CATEGORIES}
            value={CATEGORIES.indexOf(form.category)}
            onChange={e => updateField("category", CATEGORIES[Number(e.detail.value)])}
          >
            <View className={styles.picker}>{form.category}</View>
          </Picker>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>日期</Text>
          <Input
            className={styles.input}
            value={form.date}
            onInput={e => updateField("date", e.detail.value)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>摘要</Text>
          <Textarea
            className={styles.textarea}
            value={form.summary}
            maxlength={200}
            onInput={e => updateField("summary", e.detail.value)}
            placeholder="首页公告栏和列表页显示的简短描述"
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>正文（可选）</Text>
          <Textarea
            className={styles.textarea}
            value={form.content}
            maxlength={-1}
            onInput={e => updateField("content", e.detail.value)}
            placeholder="公告详情页显示的正文内容"
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>跳转链接（可选）</Text>
          <Input
            className={styles.input}
            value={form.url}
            onInput={e => updateField("url", e.detail.value)}
            placeholder="小程序页面路径，如 /pages/..."
          />
        </View>

        <View className={styles.formItem}>
          <View className={styles.switchRow}>
            <Text className={styles.label}>置顶</Text>
            <Switch
              checked={form.isTop}
              onChange={e => updateField("isTop", e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.btnRow}>
          <View className={`${styles.btn} ${styles.primary}`} onClick={handleSubmit}>
            <Text>{editingId ? "保存修改" : "立即发布"}</Text>
          </View>
          {editingId && (
            <View className={`${styles.btn} ${styles.secondary}`} onClick={handleCancel}>
              <Text>取消</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.listCard}>
        <View className={styles.sectionTitle}>已有公告</View>
        {list.length === 0 ? (
          <View className={styles.noData}>暂无公告</View>
        ) : (
          list.map(item => (
            <View key={item._id} className={styles.listItem}>
              <View className={styles.listTitle}>{item.title}</View>
              <View className={styles.listMeta}>
                {item.date} · {item.source} · {item.category} {item.isTop ? "· 置顶" : ""}
              </View>
              <View className={styles.listActions}>
                <View className={`${styles.smallBtn} ${styles.primary}`} onClick={() => handleEdit(item)}>
                  编辑
                </View>
                <View className={`${styles.smallBtn} ${styles.danger}`} onClick={() => item._id && handleDelete(item._id)}>
                  删除
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
