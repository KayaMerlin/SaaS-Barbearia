-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN "slug" TEXT;

-- Backfill slug for existing tenants (nome + 8 chars of id)
UPDATE "Tenant"
SET slug = (
  regexp_replace(
    regexp_replace(lower(regexp_replace(trim(nome), '\s+', '-', 'g')), '[^a-z0-9-]', '', 'g'),
    '-+', '-', 'g'
  ) || '-' || substring(replace(id::text, '-', ''), 1, 8)
)
WHERE slug IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");
