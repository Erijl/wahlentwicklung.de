export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bundesland: {
        Row: {
          abbreviation: string | null
          bundesland_id: number
          identifier: number | null
          name: string | null
        }
        Insert: {
          abbreviation?: string | null
          bundesland_id?: number
          identifier?: number | null
          name?: string | null
        }
        Update: {
          abbreviation?: string | null
          bundesland_id?: number
          identifier?: number | null
          name?: string | null
        }
        Relationships: []
      }
      bundesland_stimmen: {
        Row: {
          bundesland_id: number | null
          bundesland_stimmen_id: number
          gueltige_stimmen: Json | null
          ungueltige_stimmen: Json | null
          waehler: Json | null
          wahl_id: number | null
          wahlberechtigte: Json | null
        }
        Insert: {
          bundesland_id?: number | null
          bundesland_stimmen_id?: number
          gueltige_stimmen?: Json | null
          ungueltige_stimmen?: Json | null
          waehler?: Json | null
          wahl_id?: number | null
          wahlberechtigte?: Json | null
        }
        Update: {
          bundesland_id?: number | null
          bundesland_stimmen_id?: number
          gueltige_stimmen?: Json | null
          ungueltige_stimmen?: Json | null
          waehler?: Json | null
          wahl_id?: number | null
          wahlberechtigte?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "bundesland_stimmen_bundesland_id_fkey"
            columns: ["bundesland_id"]
            referencedRelation: "bundesland"
            referencedColumns: ["bundesland_id"]
          },
          {
            foreignKeyName: "bundesland_stimmen_wahl_id_fkey"
            columns: ["wahl_id"]
            referencedRelation: "wahl"
            referencedColumns: ["wahl_id"]
          }
        ]
      }
      partei: {
        Row: {
          name: string | null
          partei_id: number
          wahl_id: number | null
        }
        Insert: {
          name?: string | null
          partei_id?: number
          wahl_id?: number | null
        }
        Update: {
          name?: string | null
          partei_id?: number
          wahl_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "partei_wahl_id_fkey"
            columns: ["wahl_id"]
            referencedRelation: "wahl"
            referencedColumns: ["wahl_id"]
          }
        ]
      }
      partei_stimmen: {
        Row: {
          partei_id: number | null
          stimmen: Json | null
          vote_id: number
          wahlkreis_id: number | null
        }
        Insert: {
          partei_id?: number | null
          stimmen?: Json | null
          vote_id?: number
          wahlkreis_id?: number | null
        }
        Update: {
          partei_id?: number | null
          stimmen?: Json | null
          vote_id?: number
          wahlkreis_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "partei_stimmen_partei_id_fkey"
            columns: ["partei_id"]
            referencedRelation: "partei"
            referencedColumns: ["partei_id"]
          },
          {
            foreignKeyName: "partei_stimmen_wahlkreis_id_fkey"
            columns: ["wahlkreis_id"]
            referencedRelation: "wahlkreis"
            referencedColumns: ["wahlkreis_id"]
          }
        ]
      }
      wahl: {
        Row: {
          wahl_id: number
          year: number | null
        }
        Insert: {
          wahl_id?: number
          year?: number | null
        }
        Update: {
          wahl_id?: number
          year?: number | null
        }
        Relationships: []
      }
      wahlkreis: {
        Row: {
          bundesland_id: number | null
          gueltige_stimmen: Json | null
          identifier: number | null
          name: string | null
          ungueltige_stimmen: Json | null
          waehler: Json | null
          wahl_id: number | null
          wahlberechtigte: Json | null
          wahlkreis_id: number
        }
        Insert: {
          bundesland_id?: number | null
          gueltige_stimmen?: Json | null
          identifier?: number | null
          name?: string | null
          ungueltige_stimmen?: Json | null
          waehler?: Json | null
          wahl_id?: number | null
          wahlberechtigte?: Json | null
          wahlkreis_id?: number
        }
        Update: {
          bundesland_id?: number | null
          gueltige_stimmen?: Json | null
          identifier?: number | null
          name?: string | null
          ungueltige_stimmen?: Json | null
          waehler?: Json | null
          wahl_id?: number | null
          wahlberechtigte?: Json | null
          wahlkreis_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "wahlkreis_bundesland_id_fkey"
            columns: ["bundesland_id"]
            referencedRelation: "bundesland"
            referencedColumns: ["bundesland_id"]
          },
          {
            foreignKeyName: "wahlkreis_wahl_id_fkey"
            columns: ["wahl_id"]
            referencedRelation: "wahl"
            referencedColumns: ["wahl_id"]
          }
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
