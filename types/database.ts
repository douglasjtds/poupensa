// Tipos do banco Poupensa — espelham supabase/migrations/.
// Mantidos à mão no MVP; se o schema mudar, atualize aqui e em SCHEMA.md.

export type Household = {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
};

export type HouseholdMember = {
  household_id: string;
  user_id: string;
  created_at: string;
};

export type Item = {
  id: string;
  household_id: string;
  name: string;
  unit: string;
  created_at: string;
};

export type PurchaseRecord = {
  id: string;
  item_id: string;
  quantity: number;
  purchased_at: string; // date (YYYY-MM-DD)
  created_by: string | null;
  created_at: string;
};

export type CheckRecord = {
  id: string;
  item_id: string;
  quantity_left: number;
  checked_at: string; // date (YYYY-MM-DD)
  created_by: string | null;
  created_at: string;
};

export type DepletedRecord = {
  id: string;
  item_id: string;
  depleted_at: string; // date (YYYY-MM-DD)
  created_by: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      households: {
        Row: Household;
        Insert: Partial<Household> & { name: string };
        Update: Partial<Household>;
        Relationships: [];
      };
      household_members: {
        Row: HouseholdMember;
        Insert: HouseholdMember;
        Update: Partial<HouseholdMember>;
        Relationships: [];
      };
      items: {
        Row: Item;
        Insert: { id?: string; household_id: string; name: string; unit: string };
        Update: Partial<Item>;
        Relationships: [];
      };
      purchase_records: {
        Row: PurchaseRecord;
        Insert: {
          id?: string;
          item_id: string;
          quantity: number;
          purchased_at?: string;
          created_by?: string | null;
        };
        Update: Partial<PurchaseRecord>;
        Relationships: [];
      };
      check_records: {
        Row: CheckRecord;
        Insert: {
          id?: string;
          item_id: string;
          quantity_left: number;
          checked_at?: string;
          created_by?: string | null;
        };
        Update: Partial<CheckRecord>;
        Relationships: [];
      };
      depleted_records: {
        Row: DepletedRecord;
        Insert: {
          id?: string;
          item_id: string;
          depleted_at?: string;
          created_by?: string | null;
        };
        Update: Partial<DepletedRecord>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_household: {
        Args: { household_name: string };
        Returns: Household;
      };
      join_household_by_code: {
        Args: { code: string };
        Returns: Household;
      };
      is_household_member: {
        Args: { hid: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
