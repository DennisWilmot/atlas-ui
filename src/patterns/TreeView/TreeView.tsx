import { useMemo, useState } from "react";
import type { ReactNode } from "react";

export type TreeNode = {
  id: string;
  label: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  hidden?: boolean;
};

export type TreeViewProps = {
  className?: string;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  label?: string;
  nodes?: TreeNode[];
  onExpandedChange?: (expandedIds: string[]) => void;
  onSelect?: (nodeId: string) => void;
  selectedId?: string;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getVisibleNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes
    .filter((node) => !node.hidden)
    .map((node) => ({
      ...node,
      children: node.children ? getVisibleNodes(node.children) : undefined,
    }));
}

export function TreeView({
  className,
  defaultExpandedIds = [],
  expandedIds,
  label = "Tree",
  nodes = [],
  onExpandedChange,
  onSelect,
  selectedId,
}: TreeViewProps) {
  const visibleNodes = useMemo(() => getVisibleNodes(nodes), [nodes]);
  const isExpandedControlled = expandedIds !== undefined;
  const [internalExpandedIds, setInternalExpandedIds] = useState(defaultExpandedIds);
  const currentExpandedIds = isExpandedControlled ? expandedIds : internalExpandedIds;
  const expandedSet = useMemo(() => new Set(currentExpandedIds), [currentExpandedIds]);

  if (visibleNodes.length === 0) return null;

  function setExpanded(nextExpandedIds: string[]) {
    if (!isExpandedControlled) {
      setInternalExpandedIds(nextExpandedIds);
    }

    onExpandedChange?.(nextExpandedIds);
  }

  function toggleNode(nodeId: string) {
    const nextExpanded = new Set(expandedSet);

    if (nextExpanded.has(nodeId)) {
      nextExpanded.delete(nodeId);
    } else {
      nextExpanded.add(nodeId);
    }

    setExpanded([...nextExpanded]);
  }

  function renderNodes(renderedNodes: TreeNode[], depth = 0): ReactNode {
    return (
      <ul className="atlas-tree-view__group" role={depth === 0 ? "tree" : "group"} aria-label={depth === 0 ? label : undefined}>
        {renderedNodes.map((node) => {
          const children = node.children ?? [];
          const hasChildren = children.length > 0;
          const expanded = expandedSet.has(node.id);
          const selected = selectedId === node.id;

          return (
            <li
              aria-disabled={node.disabled || undefined}
              aria-expanded={hasChildren ? expanded : undefined}
              aria-selected={selected || undefined}
              className={joinClasses("atlas-tree-view__item", selected && "atlas-tree-view__item--selected")}
              key={node.id}
              role="treeitem"
            >
              <span className="atlas-tree-view__row" style={{ paddingLeft: `${depth * 1}rem` }}>
                {hasChildren ? (
                  <button
                    aria-label={`Toggle ${node.id}`}
                    className="atlas-tree-view__toggle"
                    onClick={() => toggleNode(node.id)}
                    type="button"
                  >
                    {expanded ? "−" : "+"}
                  </button>
                ) : (
                  <span className="atlas-tree-view__spacer" />
                )}
                <button
                  className="atlas-tree-view__label"
                  disabled={node.disabled}
                  onClick={() => {
                    if (!node.disabled) onSelect?.(node.id);
                  }}
                  type="button"
                >
                  {node.label}
                </button>
              </span>
              {hasChildren && expanded ? renderNodes(children, depth + 1) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  return <nav className={joinClasses("atlas-tree-view", className)}>{renderNodes(visibleNodes)}</nav>;
}
