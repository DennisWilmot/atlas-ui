import type { DragEvent, ReactNode } from "react";
import { useId, useMemo, useState } from "react";
import { getVisibleActions, shouldUseSearchableList } from "../../headless";
import type { Action, FileUploadItem } from "../../types";
import { ActionMenu } from "../ActionMenu";

export type FileUploaderProps = {
  files?: FileUploadItem[];
  actions?: Action[];
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  prompt?: ReactNode;
  browseLabel?: ReactNode;
  hint?: ReactNode;
  showEmptyState?: boolean;
  emptyLabel?: ReactNode;
  className?: string;
  pageSize?: number;
  searchPredicate?: (file: FileUploadItem, query: string) => boolean;
  onFilesSelected?: (files: File[]) => void;
  onAction?: (actionId: string, file?: FileUploadItem) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getVisibleFiles(files: FileUploadItem[]): FileUploadItem[] {
  const seenIds = new Set<string>();

  return files.filter((file) => {
    const id = file.id.trim();

    if (file.hidden || id.length === 0 || file.name.trim().length === 0) return false;
    if (seenIds.has(id)) return false;

    seenIds.add(id);
    return true;
  });
}

function defaultSearchPredicate(file: FileUploadItem, query: string): boolean {
  const searchText = [file.name, file.type, typeof file.status === "string" ? file.status : undefined]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchText.includes(query);
}

function formatFileSize(size: number | undefined): string | null {
  if (size === undefined || !Number.isFinite(size) || size < 0) return null;
  if (size < 1024) return `${size} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let value = size / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

function normalizeProgress(progress: number | undefined): number | null {
  if (progress === undefined || !Number.isFinite(progress)) return null;
  return Math.min(100, Math.max(0, progress));
}

function toActionState(actions: Action[], disabled: boolean): Action[] {
  if (!disabled) return actions;
  return actions.map((action) => ({ ...action, disabled: true }));
}

export function FileUploader({
  accept,
  actions = [],
  browseLabel = "Choose files",
  className,
  disabled = false,
  emptyLabel = "Nothing to show",
  files = [],
  hint,
  label = "Files",
  multiple = true,
  onAction,
  onFilesSelected,
  pageSize = 20,
  prompt = "Add files",
  readOnly = false,
  searchPredicate = defaultSearchPredicate,
  showEmptyState = false,
}: FileUploaderProps) {
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : undefined;
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const visibleFiles = useMemo(() => getVisibleFiles(files), [files]);
  const searchable = shouldUseSearchableList(visibleFiles.length);
  const pickerVisible = Boolean(onFilesSelected) && !readOnly;
  const visibleActions = readOnly ? [] : getVisibleActions(actions);
  const componentActions = toActionState(visibleActions, disabled);
  const safePageSize = Math.max(1, pageSize);

  const filteredFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!searchable || !normalizedQuery) return visibleFiles;

    return visibleFiles.filter((file) => searchPredicate(file, normalizedQuery));
  }, [query, searchable, searchPredicate, visibleFiles]);

  const hasVisibleSurface = visibleFiles.length > 0 || pickerVisible || visibleActions.length > 0;

  if (!hasVisibleSurface) {
    if (!showEmptyState) return null;
    return (
      <div className={joinClasses("atlas-empty", className)} role="status">
        {emptyLabel}
      </div>
    );
  }

  const handleSelectedFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0 || disabled || readOnly) return;
    onFilesSelected?.(selectedFiles);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    if (!pickerVisible || disabled) return;

    event.preventDefault();
    handleSelectedFiles(Array.from(event.dataTransfer.files));
  };

  const pageCount = Math.max(1, Math.ceil(filteredFiles.length / safePageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = searchable ? safePage * safePageSize : 0;
  const renderedFiles = searchable ? filteredFiles.slice(start, start + safePageSize) : visibleFiles;

  return (
    <section className={joinClasses("atlas-file-uploader", className)} aria-label={label}>
      <ActionMenu
        actions={componentActions}
        ariaLabel={`${label} actions`}
        onAction={(actionId) => {
          if (!disabled && !readOnly) onAction?.(actionId);
        }}
      />
      {pickerVisible ? (
        <label
          aria-disabled={disabled || undefined}
          className="atlas-file-uploader__dropzone"
          htmlFor={inputId}
          onDragOver={(event) => {
            if (!disabled) event.preventDefault();
          }}
          onDrop={handleDrop}
        >
          <span className="atlas-file-uploader__prompt">{prompt}</span>
          {hint ? <span className="atlas-field__hint" id={hintId}>{hint}</span> : null}
          <span className="atlas-action-menu__item" aria-hidden="true">
            {browseLabel}
          </span>
          <input
            accept={accept}
            aria-describedby={hintId}
            aria-label={`${label} file input`}
            className="atlas-file-uploader__input"
            disabled={disabled}
            id={inputId}
            multiple={multiple}
            onChange={(event) => {
              handleSelectedFiles(Array.from(event.currentTarget.files ?? []));
              event.currentTarget.value = "";
            }}
            type="file"
          />
        </label>
      ) : null}
      {searchable ? (
        <label className="atlas-field">
          <span className="atlas-field__label">{label} search</span>
          <input
            className="atlas-field__control"
            onChange={(event) => {
              setPage(0);
              setQuery(event.target.value);
            }}
            type="search"
            value={query}
          />
        </label>
      ) : null}
      {visibleFiles.length > 0 ? (
        renderedFiles.length > 0 ? (
          <ul className="atlas-file-uploader__items" aria-label={`${label} list`}>
            {renderedFiles.map((file) => {
              const progress = normalizeProgress(file.progress);
              const fileActions = readOnly ? [] : toActionState(getVisibleActions(file.actions), disabled);
              const sizeLabel = formatFileSize(file.size);
              const meta = [sizeLabel, file.type].filter(Boolean).join(" / ");

              return (
                <li className="atlas-file-uploader__item" key={file.id.trim()}>
                  <div className="atlas-file-uploader__body">
                    <span className="atlas-file-uploader__name">{file.name}</span>
                    {meta ? <span className="atlas-file-uploader__meta">{meta}</span> : null}
                    {file.description ? (
                      <span className="atlas-file-uploader__description">{file.description}</span>
                    ) : null}
                    {file.status ? <span className="atlas-file-uploader__status">{file.status}</span> : null}
                    {progress !== null ? (
                      <progress
                        aria-label={`${file.name} progress`}
                        className="atlas-file-uploader__progress"
                        max={100}
                        value={progress}
                      />
                    ) : null}
                  </div>
                  <ActionMenu
                    actions={fileActions}
                    ariaLabel={`${file.name} actions`}
                    onAction={(actionId) => {
                      if (!disabled && !readOnly) onAction?.(actionId, file);
                    }}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="atlas-empty" role="status">
            Nothing matches
          </div>
        )
      ) : null}
      {searchable && pageCount > 1 ? (
        <div className="atlas-pagination" aria-label={`${label} pagination`}>
          <button
            className="atlas-action-menu__item"
            disabled={safePage === 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            type="button"
          >
            Previous
          </button>
          <span>
            {safePage + 1} / {pageCount}
          </span>
          <button
            className="atlas-action-menu__item"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            type="button"
          >
            Next
          </button>
        </div>
      ) : null}
    </section>
  );
}
