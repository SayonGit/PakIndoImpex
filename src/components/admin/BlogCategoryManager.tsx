"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2, Loader2, Pencil, Check, X } from "lucide-react";
import type { BlogCategory } from "@prisma/client";

function sortByName(items: BlogCategory[]): BlogCategory[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

export function BlogCategoryManager({ initialItems }: { initialItems: BlogCategory[] }) {
  const [items, setItems] = useState(sortByName(initialItems));
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setAddError(null);

    const response = await fetch("/api/admin/blog-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const result = await response.json();
    if (!response.ok) {
      setAddError(result.error ?? "Something went wrong.");
      setAdding(false);
      return;
    }
    setItems((prev) => sortByName([...prev, result.item]));
    setNewName("");
    setAdding(false);
  }

  function startEdit(item: BlogCategory) {
    setEditingId(item.id);
    setEditValue(item.name);
    setEditError(null);
  }

  async function saveEdit(id: string) {
    if (!editValue.trim()) return;
    setBusyId(id);
    setEditError(null);

    const response = await fetch(`/api/admin/blog-categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editValue.trim() }),
    });
    const result = await response.json();
    if (!response.ok) {
      setEditError(result.error ?? "Something went wrong.");
      setBusyId(null);
      return;
    }
    setItems((prev) => sortByName(prev.map((item) => (item.id === id ? result.item : item))));
    setEditingId(null);
    setBusyId(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Articles that already used it keep their current category text.")) return;
    setBusyId(id);
    await fetch(`/api/admin/blog-categories/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
    setBusyId(null);
  }

  return (
    <div className="max-w-xl space-y-6">
      <form onSubmit={handleAdd} className="flex items-start gap-3">
        <div className="flex-1">
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="e.g. Export Documentation"
            className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-all duration-200 focus:border-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100"
          />
          {addError && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-secondary-600">
              {addError}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 ease-spring hover:-translate-y-0.5 disabled:opacity-60"
        >
          {adding ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Plus className="size-3.5" aria-hidden />}
          Add
        </button>
      </form>

      {items.length === 0 ? (
        <p className="shadow-soft rounded-2xl border border-ink-100 bg-white p-8 text-center text-sm text-ink-500">
          No categories yet — add one above.
        </p>
      ) : (
        <div className="shadow-soft divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-4">
              {editingId === item.id ? (
                <>
                  <div className="flex-1">
                    <input
                      value={editValue}
                      onChange={(event) => setEditValue(event.target.value)}
                      autoFocus
                      className="w-full rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-900 focus:border-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100"
                    />
                    {editError && <p className="mt-1 text-xs font-medium text-secondary-600">{editError}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => saveEdit(item.id)}
                    disabled={busyId === item.id}
                    aria-label="Save"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-primary-700 hover:bg-primary-50 disabled:opacity-50"
                  >
                    {busyId === item.id ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <Check className="size-4" aria-hidden />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </>
              ) : (
                <>
                  <p className="flex-1 text-sm font-semibold text-ink-950">{item.name}</p>
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    aria-label="Rename"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-primary-50 hover:text-primary-700"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    disabled={busyId === item.id}
                    aria-label="Delete"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-secondary-50 hover:text-secondary-700 disabled:opacity-50"
                  >
                    {busyId === item.id ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    ) : (
                      <Trash2 className="size-3.5" aria-hidden />
                    )}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
