"use client";

import { useEffect, useState } from "react";
import { deleteUsersById, getUsers, patchUsersById, postUsers } from "@/lib/api";
import type { GetUsersResponse, PostUsersData } from "@/lib/api";

type User = GetUsersResponse[number];
type UserForm = PostUsersData["body"];

const emptyForm: UserForm = {
  name: "",
  email: "",
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const { data } = await getUsers({ throwOnError: true });
      setUsers(data ?? []);
    } catch {
      setError("Unable to load users from the API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await loadUsers();
    })();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingId !== null) {
        const { data } = await patchUsersById({
          path: { id: editingId },
          body: form,
          throwOnError: true,
        });
        setUsers((current) =>
          current.map((user) => (user.id === data.id ? data : user)),
        );
      } else {
        const { data } = await postUsers({
          body: form,
          throwOnError: true,
        });
        setUsers((current) => [...current, data]);
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch {
      setError("The request could not be completed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUsersById({ path: { id }, throwOnError: true });
      setUsers((current) => current.filter((user) => user.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch {
      setError("Unable to delete the selected user.");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 p-6 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Frontend CRUD
          </p>
          <h1 className="text-3xl font-semibold">Manage users</h1>
          <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Create, update, and remove users directly from the UI using the backend API.
          </p>
        </header>

        <section className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit user" : "Add a user"}
              </h2>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Cancel
                </button>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block space-y-2 text-sm font-medium">
                <span>Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none ring-0 transition focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950"
                  placeholder="Enter a name"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium">
                <span>Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none ring-0 transition focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950"
                  placeholder="Enter an email"
                />
              </label>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300"
              >
                {submitting ? "Saving..." : editingId ? "Update user" : "Create user"}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Users</h2>
              <span className="text-sm text-zinc-500">{users.length} total</span>
            </div>

            {loading ? (
              <p className="text-sm text-zinc-500">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
                No users yet. Create the first one from the form.
              </p>
            ) : (
              <ul className="space-y-3">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-zinc-500">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm transition hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 transition hover:border-red-500 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
