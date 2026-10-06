"use client";
import { Box, IconButton } from "@mui/material";
import { keyframes } from "@emotion/react";
import AddCircleOutlineRounded from "@mui/icons-material/AddCircleOutlineRounded";
import KeyboardArrowLeftRounded from "@mui/icons-material/KeyboardArrowLeftRounded";
import MoreVertRounded from "@mui/icons-material/MoreVertRounded";

const LINE = "#cdb4b4";
const GAP = "var(--gap)";

const pop = keyframes`
  from { opacity: 0; transform: translateX(14px) scale(.96); }
  to { opacity: 1; transform: none; }
`;

const boxSx = (filled, isCut) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: { xs: 1, md: 1.5 },
  minWidth: "var(--w)",
  px: { xs: 1.2, md: 2 },
  py: { xs: 0.8, md: 1.1 },
  fontSize: { xs: 12, md: 13 },
  fontWeight: filled ? 700 : 500,
  borderRadius: "10px",
  border: "1px solid",
  borderStyle: isCut ? "dashed" : "solid",
  borderColor: filled ? "transparent" : "#dba8a8",
  color: filled ? "#fff" : "#6b4a4a",
  background: filled
    ? "linear-gradient(135deg,#d9a0a0,#bf7676)"
    : "linear-gradient(180deg,rgba(255,255,255,.95),rgba(255,247,247,.9))",
  boxShadow: filled ? "0 8px 22px rgba(191,118,118,.35)" : "0 2px 8px rgba(120,70,70,.07)",
  opacity: isCut ? 0.45 : 1,
  cursor: "pointer",
  userSelect: "none",
  transition: "all .18s ease",
  animation: `${pop} .28s ease`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: filled ? "0 12px 28px rgba(191,118,118,.45)" : "0 8px 20px rgba(191,118,118,.22)",
    borderColor: filled ? "transparent" : "#c27b7b",
  },
});

const rowSx = (first, last) => ({
  position: "relative",
  paddingInlineStart: GAP,
  py: { xs: "5px", md: "7px" },
  "&::before": {
    content: '""',
    position: "absolute",
    insetInlineStart: 0,
    top: "50%",
    width: GAP,
    height: "1.5px",
    background: LINE,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    insetInlineStart: 0,
    width: "1.5px",
    background: LINE,
    top: first ? "50%" : 0,
    bottom: last ? "50%" : 0,
    display: first && last ? "none" : "block",
  },
});

export default function TreeNode({ node, clipboard, onToggle, onMenu, onAdd }) {
  // const has = node.children.length > 0;
  const filled = node.open;
  const isCut = clipboard?.mode === "cut" && clipboard.sourceId === node.id;
  const total = node.children.length + 1;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={boxSx(filled, isCut)}
        onClick={() => onToggle(node.id)}
        onContextMenu={(e) => {
          e.preventDefault();
          onMenu(e, node);
        }}
      >
        <span>{node.label}</span>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
          <KeyboardArrowLeftRounded
            sx={{ fontSize: 18, transition: "transform .2s", transform: node.open ? "rotate(-90deg)" : "none" }}
          />
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMenu(e, node);
            }}
            sx={{ display: { xs: "inline-flex", md: "none" }, color: "inherit", p: 0.3 }}
          >
            <MoreVertRounded sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {node.open && (
        <Box
          sx={{
            position: "relative",
            marginInlineStart: GAP,
            "&::before": {
              content: '""',
              position: "absolute",
              insetInlineStart: "calc(var(--gap) * -1)",
              top: "50%",
              width: GAP,
              height: "1.5px",
              background: LINE,
            },
          }}
        >
          {node.children.map((c, i) => (
            <Box key={c.id} sx={rowSx(i === 0, i === total - 1)}>
              <TreeNode node={c} clipboard={clipboard} onToggle={onToggle} onMenu={onMenu} onAdd={onAdd} />
            </Box>
          ))}
          <Box sx={rowSx(total === 1, true)}>
            <Box
              onClick={() => onAdd(node.id)}
              sx={{
                ...boxSx(false, false),
                justifyContent: "center",
                borderStyle: "dashed",
                color: "#c27b7b",
                background: "transparent",
                boxShadow: "none",
              }}
            >
              <AddCircleOutlineRounded sx={{ fontSize: 17 }} />
              <span>افزودن</span>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}