"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { Article, BlogCategory } from "@prisma/client";

type Status = "idle" | "loading" | "error";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ArticleForm({ initial, categories }: { initial?: Article; categories: BlogCategory[] }) {
  const router = useRouter();
  const categoryOptions = Array.from(
    new Set([...categories.map((c) => c.name), ...(initial?.category ? [initial.category] : [])])
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(initial?.coverImageUrl ?? null);
  const [published, setPublished] = useState(initial?.published ?? false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const tags = String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      excerpt: formData.get("excerpt"),
      content,
      author: formData.get("author"),
      category: formData.get("category"),
      tags,
      coverImageUrl: coverImageUrl ?? "",
      seoTitle: formData.get("seoTitle"),
      seoDescription: formData.get("seoDescription"),
      published,
      publishDate: formData.get("publishDate"),
    };

    try {
      const response = await fetch(initial ? `/api/admin/articles/${initial.id}` : "/api/admin/articles", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        const rawFieldErrors = result.issues?.fieldErrors as Record<string, string[]> | undefined;
        if (rawFieldErrors) {
          const flattened: Record<string, string> = {};
          for (const [field, messages] of Object.entries(rawFieldErrors)) {
            if (messages?.[0]) flattened[field] = messages[0];
          }
          setFieldErrors(flattened);
        }
        setError(result.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      router.push("/admin/articles");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  const publishDateDefault = initial ? initial.publishDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="shadow-soft space-y-5 rounded-2xl border border-ink-100 bg-white p-6">
        <TextField
          label="Title"
          name="title"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          error={fieldErrors.title}
          required
        />
        <TextField
          label="Slug"
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(slugify(event.target.value));
          }}
          hint="Used in the article URL — lowercase letters, numbers, and hyphens only."
          error={fieldErrors.slug}
          required
        />
        <TextAreaField
          label="Excerpt"
          name="excerpt"
          defaultValue={initial?.excerpt}
          error={fieldErrors.excerpt}
          required
          rows={2}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <TextField label="Author" name="author" defaultValue={initial?.author} error={fieldErrors.author} required />
          <SelectField
            label="Category"
            name="category"
            options={categoryOptions}
            defaultValue={initial?.category}
            placeholder={categoryOptions.length > 0 ? "Select a category" : "Add a category first"}
            error={fieldErrors.category}
            required
          />
          <TextField
            label="Publish Date"
            name="publishDate"
            type="date"
            defaultValue={publishDateDefault}
            error={fieldErrors.publishDate}
            required
          />
        </div>
        <Link href="/admin/articles/categories" className="-mt-3 inline-block text-xs font-semibold text-primary-700 hover:underline">
          Manage categories
        </Link>
        <TextField
          label="Tags"
          name="tags"
          defaultValue={initial?.tags.join(", ")}
          placeholder="e.g. shipping, incoterms, export"
          hint="Comma-separated."
        />

        <ImageUploadField
          label="Cover Image (optional)"
          value={coverImageUrl}
          onChange={setCoverImageUrl}
          category="articles"
          hint="Shown at the top of the article and on the Blog listing card."
        />

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-800">Content</label>
          <RichTextEditor content={content} onChange={setContent} />
          {fieldErrors.content && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-secondary-600">
              {fieldErrors.content}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2.5 text-sm font-semibold text-ink-800">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            className="size-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
          />
          Published (visible on the site)
        </label>
      </div>

      <div className="shadow-soft space-y-5 rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="text-sm font-bold tracking-wide text-ink-500 uppercase">SEO</h2>
        <TextField
          label="SEO Title"
          name="seoTitle"
          defaultValue={initial?.seoTitle}
          error={fieldErrors.seoTitle}
          required
        />
        <TextAreaField
          label="SEO Description"
          name="seoDescription"
          defaultValue={initial?.seoDescription}
          error={fieldErrors.seoDescription}
          required
          rows={2}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          {initial ? "Save Changes" : "Create Article"}
        </Button>
        {error && (
          <span className="text-sm font-medium text-secondary-600">
            {Object.keys(fieldErrors).length > 0 ? "Please fix the highlighted fields above." : error}
          </span>
        )}
      </div>
    </form>
  );
}
