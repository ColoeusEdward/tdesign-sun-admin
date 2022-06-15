// atom.js
import { atom } from "jotai";

// 三个输入框的atom
export const aliasAtom = atom("");
export const textAtom = atom("");
export const filterAtom = atom("");

// 全部列表atom，每个atom都是包含alias和text的对象
const itemListAtom = atom<any[]>([]);

// 当前选中atom，包含alias和text的对象
const currentSelectAtom = atom(null);

// 派生atom，获取过滤后的列表
export const filteredByAliasListAtom = atom((get) => {
  const filter = get(filterAtom);
  const list = get(itemListAtom);

  return filter
    ? list.filter((itemAtom) => get<any>(itemAtom).alias.includes(filter))
    : list;
});

// 派生atom，获取/设定当前选中的列表项atom
export const selectItemAtom = atom(
  (get) => get(currentSelectAtom),
  (get, set, itemAtom:any) => {
    set(currentSelectAtom, itemAtom);
    if (itemAtom) {
      const { alias, text } = get(itemAtom);
      set(aliasAtom, alias);
      set(textAtom, text);
    }
  }
);

// 仅更新atom，创建列表的新项
export const createItemAtom = atom(null, (get, set) => {
  const alias = get(aliasAtom);
  const text = get(textAtom);

  if (alias && text) {
    const itemAtom = atom({ alias, text });
    set(itemListAtom, (prev) => [...prev, itemAtom]);
    set(aliasAtom, "");
    set(textAtom, "");
  }
});

// 仅更新atom，更新列表中选中的单项atom
export const updateItemAtom = atom(null, (get, set) => {
  const alias = get(aliasAtom);
  const text = get(textAtom);
  const current = get(selectItemAtom);
  if (alias && text && current) {
    set(current, { alias, text });
  }
});

// 仅更新atom，删除列表中选中的单项atom
export const deleteItemAtom = atom(null, (get, set) => {
  const current = get(selectItemAtom);
  if (current) {
    set(itemListAtom, (prev) => prev.filter((item) => item !== current));
  }
});