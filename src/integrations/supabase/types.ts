export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      buyer_profiles: {
        Row: {
          budget_high: number | null
          budget_low: number | null
          buyer_type: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          proof_of_funds: boolean | null
          status: string | null
          target_markets: string | null
          user_id: string | null
        }
        Insert: {
          budget_high?: number | null
          budget_low?: number | null
          buyer_type: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          proof_of_funds?: boolean | null
          status?: string | null
          target_markets?: string | null
          user_id?: string | null
        }
        Update: {
          budget_high?: number | null
          budget_low?: number | null
          buyer_type?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          proof_of_funds?: boolean | null
          status?: string | null
          target_markets?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_room_requests: {
        Row: {
          budget: number | null
          buyer_email: string
          buyer_name: string
          buyer_type: string | null
          created_at: string | null
          id: string
          listing_id: string | null
          message: string | null
          proof_of_funds: boolean | null
          status: string | null
        }
        Insert: {
          budget?: number | null
          buyer_email: string
          buyer_name: string
          buyer_type?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          message?: string | null
          proof_of_funds?: boolean | null
          status?: string | null
        }
        Update: {
          budget?: number | null
          buyer_email?: string
          buyer_name?: string
          buyer_type?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          message?: string | null
          proof_of_funds?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_room_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          adr: number | null
          asking_high: number | null
          asking_low: number | null
          avg_review_score: number | null
          business_type: string
          created_at: string | null
          direct_booking_pct: number | null
          gross_revenue_ltm: number | null
          headline: string | null
          hero_image_url: string | null
          id: string
          occupancy_pct: number | null
          owner_id: string | null
          readiness_score: number | null
          region: string | null
          sde: number | null
          source_url: string | null
          status: string | null
          teaser_paragraph: string | null
          units: number | null
          valuation_id: string | null
          verified: boolean | null
        }
        Insert: {
          adr?: number | null
          asking_high?: number | null
          asking_low?: number | null
          avg_review_score?: number | null
          business_type: string
          created_at?: string | null
          direct_booking_pct?: number | null
          gross_revenue_ltm?: number | null
          headline?: string | null
          hero_image_url?: string | null
          id?: string
          occupancy_pct?: number | null
          owner_id?: string | null
          readiness_score?: number | null
          region?: string | null
          sde?: number | null
          source_url?: string | null
          status?: string | null
          teaser_paragraph?: string | null
          units?: number | null
          valuation_id?: string | null
          verified?: boolean | null
        }
        Update: {
          adr?: number | null
          asking_high?: number | null
          asking_low?: number | null
          avg_review_score?: number | null
          business_type?: string
          created_at?: string | null
          direct_booking_pct?: number | null
          gross_revenue_ltm?: number | null
          headline?: string | null
          hero_image_url?: string | null
          id?: string
          occupancy_pct?: number | null
          owner_id?: string | null
          readiness_score?: number | null
          region?: string | null
          sde?: number | null
          source_url?: string | null
          status?: string | null
          teaser_paragraph?: string | null
          units?: number | null
          valuation_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      valuation_requests: {
        Row: {
          adr: number | null
          avg_review_score: number | null
          business_type: string
          created_at: string | null
          direct_booking_pct: number | null
          email: string
          full_name: string | null
          gross_revenue_ltm: number | null
          id: string
          listing_url: string | null
          market_city: string | null
          market_state: string | null
          occupancy_pct: number | null
          owner_hours_per_week: number | null
          sde: number | null
          sde_unknown: boolean | null
          sell_timeline: string | null
          source_file_url: string | null
          units: number | null
        }
        Insert: {
          adr?: number | null
          avg_review_score?: number | null
          business_type: string
          created_at?: string | null
          direct_booking_pct?: number | null
          email: string
          full_name?: string | null
          gross_revenue_ltm?: number | null
          id?: string
          listing_url?: string | null
          market_city?: string | null
          market_state?: string | null
          occupancy_pct?: number | null
          owner_hours_per_week?: number | null
          sde?: number | null
          sde_unknown?: boolean | null
          sell_timeline?: string | null
          source_file_url?: string | null
          units?: number | null
        }
        Update: {
          adr?: number | null
          avg_review_score?: number | null
          business_type?: string
          created_at?: string | null
          direct_booking_pct?: number | null
          email?: string
          full_name?: string | null
          gross_revenue_ltm?: number | null
          id?: string
          listing_url?: string | null
          market_city?: string | null
          market_state?: string | null
          occupancy_pct?: number | null
          owner_hours_per_week?: number | null
          sde?: number | null
          sde_unknown?: boolean | null
          sell_timeline?: string | null
          source_file_url?: string | null
          units?: number | null
        }
        Relationships: []
      }
      valuations: {
        Row: {
          created_at: string | null
          drivers: Json | null
          gaps: Json | null
          high: number
          id: string
          low: number
          methodology: string | null
          multiple_used: string | null
          readiness_score: number | null
          request_id: string | null
          serial: string | null
          subscores: Json | null
          teaser_paragraph: string | null
        }
        Insert: {
          created_at?: string | null
          drivers?: Json | null
          gaps?: Json | null
          high: number
          id?: string
          low: number
          methodology?: string | null
          multiple_used?: string | null
          readiness_score?: number | null
          request_id?: string | null
          serial?: string | null
          subscores?: Json | null
          teaser_paragraph?: string | null
        }
        Update: {
          created_at?: string | null
          drivers?: Json | null
          gaps?: Json | null
          high?: number
          id?: string
          low?: number
          methodology?: string | null
          multiple_used?: string | null
          readiness_score?: number | null
          request_id?: string | null
          serial?: string | null
          subscores?: Json | null
          teaser_paragraph?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valuations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "valuation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
