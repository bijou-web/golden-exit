
-- 1) listings: require authenticated owner on insert
DROP POLICY IF EXISTS "owner inserts listings" ON public.listings;
CREATE POLICY "owner inserts listings"
  ON public.listings
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- 2) valuations: remove public read; add owner-scoped read via valuation_requests.email
DROP POLICY IF EXISTS "anon read valuations" ON public.valuations;
CREATE POLICY "owner reads own valuations"
  ON public.valuations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.valuation_requests vr
      WHERE vr.id = valuations.request_id
        AND lower(vr.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

-- 3) buyer_profiles: add owner-scoped SELECT
DROP POLICY IF EXISTS "owner reads own buyer_profile" ON public.buyer_profiles;
CREATE POLICY "owner reads own buyer_profile"
  ON public.buyer_profiles
  FOR SELECT
  TO authenticated
  USING (
    (user_id IS NOT NULL AND user_id = auth.uid())
    OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- 4) valuation_requests: add owner-scoped SELECT by email claim
DROP POLICY IF EXISTS "owner reads own valuation_requests" ON public.valuation_requests;
CREATE POLICY "owner reads own valuation_requests"
  ON public.valuation_requests
  FOR SELECT
  TO authenticated
  USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- 5) Replace INSERT policies that used `WITH CHECK (true)` with validated checks

-- valuations: only server-side (service role bypasses RLS); block anon inserts
DROP POLICY IF EXISTS "anon insert valuations" ON public.valuations;
CREATE POLICY "no client valuations insert"
  ON public.valuations
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- buyer_profiles: require well-formed email + name
DROP POLICY IF EXISTS "anon insert buyer_profiles" ON public.buyer_profiles;
CREATE POLICY "public submit buyer_profiles"
  ON public.buyer_profiles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND full_name IS NOT NULL
    AND length(btrim(full_name)) > 0
    AND buyer_type IS NOT NULL
  );

-- deal_room_requests: require listing + well-formed email + name
DROP POLICY IF EXISTS "anon insert deal_room_requests" ON public.deal_room_requests;
CREATE POLICY "public submit deal_room_requests"
  ON public.deal_room_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    buyer_email IS NOT NULL
    AND buyer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND buyer_name IS NOT NULL
    AND length(btrim(buyer_name)) > 0
    AND listing_id IS NOT NULL
  );

-- valuation_requests: require well-formed email + business_type
DROP POLICY IF EXISTS "anon insert valuation_requests" ON public.valuation_requests;
CREATE POLICY "public submit valuation_requests"
  ON public.valuation_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND business_type IS NOT NULL
    AND length(btrim(business_type)) > 0
  );
