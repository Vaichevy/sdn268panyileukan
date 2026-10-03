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
      gallery_items: {
        Row: {
          created_at: string
          description: string
          event_date: string | null
          id: string
          image_url: string
          images: string[]
          is_public: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          event_date?: string | null
          id?: string
          image_url: string
          images?: string[]
          is_public?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          event_date?: string | null
          id?: string
          image_url?: string
          images?: string[]
          is_public?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_items: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          images: string[]
          is_public: boolean
          published_at: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          images?: string[]
          is_public?: boolean
          published_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          images?: string[]
          is_public?: boolean
          published_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reel_items: {
        Row: {
          caption: string | null
          created_at: string
          event_date: string | null
          id: string
          instagram_url: string
          is_public: boolean
          sort_order: number
          thumbnail_url: string
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          event_date?: string | null
          id?: string
          instagram_url: string
          is_public?: boolean
          sort_order?: number
          thumbnail_url?: string
          title: string
          updated_at?: string
          video_url?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          event_date?: string | null
          id?: string
          instagram_url?: string
          is_public?: boolean
          sort_order?: number
          thumbnail_url?: string
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_text: string
          address: string
          apps_items: string
          banner_height: number
          banner_pos_x: number
          banner_pos_y: number
          banner_zoom: number
          created_at: string
          ekskul_heading: string
          ekskul_items: string
          email: string
          evaluasi_heading: string
          evaluasi_intro: string
          evaluasi_kalender: string
          evaluasi_kalender_heading: string
          evaluasi_kalender_note: string
          evaluasi_pendampingan: string
          evaluasi_pendampingan_heading: string
          evaluasi_siklus: string
          evaluasi_siklus_heading: string
          headmaster_name: string
          headmaster_photo_url: string | null
          headmaster_speech: string
          headmaster_title: string
          hero_image_url: string | null
          id: string
          is_public: boolean
          kka_fase: string
          kka_heading: string
          kka_intro: string
          kokurikuler_heading: string
          kokurikuler_intro: string
          kokurikuler_items: string
          logo_url: string | null
          maps_embed_url: string
          mission: string
          npsn: string
          pembelajaran_deep: string
          pembelajaran_dimensi: string
          pembelajaran_eyebrow: string
          pembelajaran_fase: string
          pembelajaran_heading: string
          pembelajaran_intro: string
          pembelajaran_sesi: string
          pembelajaran_siklus: string
          pembiasaan_harian_heading: string
          pembiasaan_harian_items: string
          pembiasaan_mingguan_heading: string
          pembiasaan_mingguan_items: string
          penilaian_alur: string
          penilaian_alur_heading: string
          penilaian_alur_note: string
          penilaian_asesmen: string
          penilaian_asesmen_heading: string
          penilaian_heading: string
          penilaian_intro: string
          penilaian_syarat: string
          penilaian_syarat_heading: string
          phone: string
          running_text: string | null
          running_text_enabled: boolean
          running_text_speed: number
          school_name: string
          sekilas_eyebrow: string
          sekilas_heading: string
          sekilas_lingkungan: string
          sekilas_murid: string
          sekilas_ptk: string
          sekilas_sarana: string
          stat_accreditation: string
          stat_classrooms: string
          stat_students: string
          stat_teachers: string
          tagline: string
          updated_at: string
          vision: string
        }
        Insert: {
          about_text?: string
          address?: string
          apps_items?: string
          banner_height?: number
          banner_pos_x?: number
          banner_pos_y?: number
          banner_zoom?: number
          created_at?: string
          ekskul_heading?: string
          ekskul_items?: string
          email?: string
          evaluasi_heading?: string
          evaluasi_intro?: string
          evaluasi_kalender?: string
          evaluasi_kalender_heading?: string
          evaluasi_kalender_note?: string
          evaluasi_pendampingan?: string
          evaluasi_pendampingan_heading?: string
          evaluasi_siklus?: string
          evaluasi_siklus_heading?: string
          headmaster_name?: string
          headmaster_photo_url?: string | null
          headmaster_speech?: string
          headmaster_title?: string
          hero_image_url?: string | null
          id?: string
          is_public?: boolean
          kka_fase?: string
          kka_heading?: string
          kka_intro?: string
          kokurikuler_heading?: string
          kokurikuler_intro?: string
          kokurikuler_items?: string
          logo_url?: string | null
          maps_embed_url?: string
          mission?: string
          npsn?: string
          pembelajaran_deep?: string
          pembelajaran_dimensi?: string
          pembelajaran_eyebrow?: string
          pembelajaran_fase?: string
          pembelajaran_heading?: string
          pembelajaran_intro?: string
          pembelajaran_sesi?: string
          pembelajaran_siklus?: string
          pembiasaan_harian_heading?: string
          pembiasaan_harian_items?: string
          pembiasaan_mingguan_heading?: string
          pembiasaan_mingguan_items?: string
          penilaian_alur?: string
          penilaian_alur_heading?: string
          penilaian_alur_note?: string
          penilaian_asesmen?: string
          penilaian_asesmen_heading?: string
          penilaian_heading?: string
          penilaian_intro?: string
          penilaian_syarat?: string
          penilaian_syarat_heading?: string
          phone?: string
          running_text?: string | null
          running_text_enabled?: boolean
          running_text_speed?: number
          school_name?: string
          sekilas_eyebrow?: string
          sekilas_heading?: string
          sekilas_lingkungan?: string
          sekilas_murid?: string
          sekilas_ptk?: string
          sekilas_sarana?: string
          stat_accreditation?: string
          stat_classrooms?: string
          stat_students?: string
          stat_teachers?: string
          tagline?: string
          updated_at?: string
          vision?: string
        }
        Update: {
          about_text?: string
          address?: string
          apps_items?: string
          banner_height?: number
          banner_pos_x?: number
          banner_pos_y?: number
          banner_zoom?: number
          created_at?: string
          ekskul_heading?: string
          ekskul_items?: string
          email?: string
          evaluasi_heading?: string
          evaluasi_intro?: string
          evaluasi_kalender?: string
          evaluasi_kalender_heading?: string
          evaluasi_kalender_note?: string
          evaluasi_pendampingan?: string
          evaluasi_pendampingan_heading?: string
          evaluasi_siklus?: string
          evaluasi_siklus_heading?: string
          headmaster_name?: string
          headmaster_photo_url?: string | null
          headmaster_speech?: string
          headmaster_title?: string
          hero_image_url?: string | null
          id?: string
          is_public?: boolean
          kka_fase?: string
          kka_heading?: string
          kka_intro?: string
          kokurikuler_heading?: string
          kokurikuler_intro?: string
          kokurikuler_items?: string
          logo_url?: string | null
          maps_embed_url?: string
          mission?: string
          npsn?: string
          pembelajaran_deep?: string
          pembelajaran_dimensi?: string
          pembelajaran_eyebrow?: string
          pembelajaran_fase?: string
          pembelajaran_heading?: string
          pembelajaran_intro?: string
          pembelajaran_sesi?: string
          pembelajaran_siklus?: string
          pembiasaan_harian_heading?: string
          pembiasaan_harian_items?: string
          pembiasaan_mingguan_heading?: string
          pembiasaan_mingguan_items?: string
          penilaian_alur?: string
          penilaian_alur_heading?: string
          penilaian_alur_note?: string
          penilaian_asesmen?: string
          penilaian_asesmen_heading?: string
          penilaian_heading?: string
          penilaian_intro?: string
          penilaian_syarat?: string
          penilaian_syarat_heading?: string
          phone?: string
          running_text?: string | null
          running_text_enabled?: boolean
          running_text_speed?: number
          school_name?: string
          sekilas_eyebrow?: string
          sekilas_heading?: string
          sekilas_lingkungan?: string
          sekilas_murid?: string
          sekilas_ptk?: string
          sekilas_sarana?: string
          stat_accreditation?: string
          stat_classrooms?: string
          stat_students?: string
          stat_teachers?: string
          tagline?: string
          updated_at?: string
          vision?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          external_id: string | null
          id: string
          is_approved: boolean
          message: string
          name: string
          rating: number
          source: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          external_id?: string | null
          id?: string
          is_approved?: boolean
          message?: string
          name?: string
          rating?: number
          source?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          external_id?: string | null
          id?: string
          is_approved?: boolean
          message?: string
          name?: string
          rating?: number
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_items: {
        Row: {
          created_at: string
          description: string
          event_date: string | null
          id: string
          is_public: boolean
          sort_order: number
          thumbnail_url: string
          title: string
          updated_at: string
          video_url: string
          youtube_url: string
        }
        Insert: {
          created_at?: string
          description?: string
          event_date?: string | null
          id?: string
          is_public?: boolean
          sort_order?: number
          thumbnail_url?: string
          title: string
          updated_at?: string
          video_url?: string
          youtube_url?: string
        }
        Update: {
          created_at?: string
          description?: string
          event_date?: string | null
          id?: string
          is_public?: boolean
          sort_order?: number
          thumbnail_url?: string
          title?: string
          updated_at?: string
          video_url?: string
          youtube_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
