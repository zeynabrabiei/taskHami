let counter = 1000;
export const uid = () => `n${++counter}${Math.random().toString(36).slice(2, 6)}`;

const mk = (id, label, children = [], open = false) => ({ id, label, children, open });

export const initialTree = [
  mk("1", "۱  دارایی های جاری", [
    mk("101", "۱۰۱  وجوه نقد", [mk("10101", "۱۰۱۰۱  تن خواه"), mk("10102", "۱۰۱۰۲  بانک")], true),
  ], true),
  mk("2", "۲  دارایی های غیر جاری"),
  mk("3", "۳  بدهی های جاری"),
  mk("4", "۴  بدهی های غیر جاری"),
  mk("5", "۵  حقوق صاحبان سهام (سرمایه)"),
  mk("6", "۶  درآمد"),
  mk("7", "۷  قیمت تمام شده"),
  mk("8", "۸  هزینه ها"),
  mk("9", "۹  حساب های انتظامی"),
];

export const find = (nodes, id) => {
  for (const n of nodes) {
    if (n.id === id) return n;
    const f = find(n.children, id);
    if (f) return f;
  }
  return null;
};

export const update = (nodes, id, fn) =>
  nodes.map((n) => (n.id === id ? fn(n) : { ...n, children: update(n.children, id, fn) }));

export const remove = (nodes, id) =>
  nodes.filter((n) => n.id !== id).map((n) => ({ ...n, children: remove(n.children, id) }));

export const cloneNode = (n) => ({ ...n, id: uid(), children: n.children.map(cloneNode) });