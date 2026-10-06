"use client";
import { useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, ListItemIcon, Menu, MenuItem, TextField, Typography,
} from "@mui/material";
import ContentCutRounded from "@mui/icons-material/ContentCutRounded";
import ContentCopyRounded from "@mui/icons-material/ContentCopyRounded";
import ContentPasteRounded from "@mui/icons-material/ContentPasteRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import TreeNode from "../components/TreeNode";
import { initialTree, find, update, remove, cloneNode, uid } from "../lib/tree";

export default function Page() {
  const [tree, setTree] = useState(initialTree);
  const [clip, setClip] = useState(null);
  const [menu, setMenu] = useState(null);
  const [dlg, setDlg] = useState(null);
  const [label, setLabel] = useState("");

  const closeMenu = () => setMenu(null);
  const hasKids = menu?.node.children.length > 0;

  const toggle = (id) => setTree((t) => update(t, id, (n) => ({ ...n, open: !n.open })));
  const openMenu = (e, node) => setMenu({ x: e.clientX, y: e.clientY, node });

  const doCut = () => {
    setClip({ mode: "cut", sourceId: menu.node.id });
    closeMenu();
  };

  const doCopy = () => {
    setClip({ mode: "copy", node: menu.node });
    closeMenu();
  };

  const doPaste = () => {
    const targetId = menu.node.id;
    if (clip.mode === "cut") {
      const live = find(tree, clip.sourceId);
      if (live && !find([live], targetId)) {
        setTree((t) =>
          update(remove(t, live.id), targetId, (n) => ({ ...n, open: true, children: [...n.children, live] }))
        );
      }
      setClip(null);
    } else {
      setTree((t) =>
        update(t, targetId, (n) => ({ ...n, open: true, children: [...n.children, cloneNode(clip.node)] }))
      );
    }
    closeMenu();
  };

  const doDelete = () => {
    const id = menu.node.id;
    setTree((t) => remove(t, id));
    if (clip?.sourceId === id) setClip(null);
    closeMenu();
  };

  const startAdd = (id) => {
    setLabel("");
    setDlg(id);
    closeMenu();
  };

  const submit = () => {
    const v = label.trim();
    if (!v) return;
    setTree((t) =>
      update(t, dlg, (n) => ({
        ...n,
        open: true,
        children: [...n.children, { id: uid(), label: v, open: false, children: [] }],
      }))
    );
    setDlg(null);
  };

  const pasteDisabled = !clip || (clip.mode === "cut" && clip.sourceId === menu?.node.id);

  return (
<Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 6 },
        overflowX: "auto",
        background:
          "radial-gradient(900px 500px at 90% -10%, #f7dede 0%, transparent 60%), radial-gradient(800px 500px at 0% 110%, #efe3f5 0%, transparent 60%), #fbf7f7",
      }}
    >
      <Typography variant="h5" fontWeight={800} color="#5b3a3a" mb={0.5} sx={{ fontSize: { xs: 18, md: 24 } }}>
        حساب‌های اصلی
      </Typography>
      <Typography variant="body2" color="#9a7b7b" mb={{ xs: 3, md: 5 }} sx={{ fontSize: { xs: 12, md: 14 } }}>
        روی هر آیتم کلیک کنید تا باز یا بسته شود، و برای منو راست‌کلیک کنید (در موبایل از دکمه ⋮).
      </Typography>

      <Box
        sx={{
          "--gap": "16px",
          "--w": "120px",
          "@media (min-width:600px)": { "--gap": "26px", "--w": "160px" },
          "@media (min-width:900px)": { "--gap": "34px", "--w": "190px" },
          width: "max-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: { xs: 1.4, md: 2.2 },
          pb: 6,
        }}
      >
        {tree.map((n) => (
          <TreeNode key={n.id} node={n} clipboard={clip} onToggle={toggle} onMenu={openMenu} onAdd={startAdd} />
        ))}
      </Box>

      <Menu
        open={!!menu}
        onClose={closeMenu}
        anchorReference="anchorPosition"
        anchorPosition={menu ? { top: menu.y, left: menu.x } : undefined}
        slotProps={{
          root: { onContextMenu: (e) => { e.preventDefault(); closeMenu(); } },
          paper: {
            sx: {
              minWidth: 190,
              borderRadius: "14px",
              border: "1px solid #f0dcdc",
              boxShadow: "0 18px 40px rgba(120,70,70,.2)",
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,.92)",
            },
          },
        }}
      >
        <MenuItem disabled={hasKids} onClick={doCut}>
          <ListItemIcon><ContentCutRounded fontSize="small" /></ListItemIcon>برش دادن
        </MenuItem>
        <MenuItem onClick={doCopy}>
          <ListItemIcon><ContentCopyRounded fontSize="small" /></ListItemIcon>کپی کردن
        </MenuItem>
        <MenuItem disabled={pasteDisabled} onClick={doPaste}>
          <ListItemIcon><ContentPasteRounded fontSize="small" /></ListItemIcon>پیست کردن
        </MenuItem>
        <MenuItem disabled={hasKids} onClick={doDelete} sx={{ color: hasKids ? undefined : "error.main" }}>
          <ListItemIcon><DeleteOutlineRounded fontSize="small" color={hasKids ? "inherit" : "error"} /></ListItemIcon>حذف
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => startAdd(menu.node.id)}>
          <ListItemIcon><AddRounded fontSize="small" /></ListItemIcon>افزودن زیرشاخه
        </MenuItem>
      </Menu>

      <Dialog
        open={dlg !== null}
        onClose={() => setDlg(null)}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: "18px", p: 1 } } }}
      >
        <DialogTitle fontWeight={800}>افزودن زیرشاخه</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="عنوان"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDlg(null)} color="inherit">انصراف</Button>
          <Button variant="contained" disableElevation onClick={submit} disabled={!label.trim()}>
            افزودن
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}