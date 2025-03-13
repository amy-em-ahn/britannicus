import { createClient } from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";

// Supabase Config
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);



export async function login() {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Login error:", error);
    return user;
  }
  
  export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error);
  }
  


  export function onUserStateChange(callback) {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const user = session.user;
        const updatedUser = user ? await adminUser(user) : null;
        callback(updatedUser);
      } else {
        callback(null);
      }
    });
  }


  async function adminUser(user) {
    let { data: adminList, error } = await supabase.from("admin").select("user_id");
    if (error) {
      console.error("Error fetching admin users:", error);
      return user;
    }
  
    const isAdmin = adminList.some((admin) => admin.user_id === user.id);
    return { ...user, isAdmin };
  }
  
  


  
  export async function addNewProduct(product, imageUrl) {
    const id = uuid();
  
    // Insert into BaseProduct (common fields)
    const { error: baseError } = await supabase.from("Product").insert([
      {
        id,
        title: product.title,
        price: parseFloat(product.price),
        currency: product.currency || "USD",
        seller: product.seller || null,
        location: product.location || null,
        description: product.description || null,
        imageUrl: imageUrl,
        saleOptions: product.options || "Individual",
        publishedBy: product.publishedby || null,
        pubDate: product.year ? `${product.year}-01-01` : null, // Default to Jan 1st if year is provided
        createdAt: new Date().toISOString(),
        stock: product.stock ? parseInt(product.stock) : null,
        constin: product.condition || "Good",
      },
    ]);
  
    if (baseError) {
      console.error("Error inserting into BaseProduct:", baseError);
      throw baseError;
    }
  
    // Determine category and insert into the appropriate table
    if (product.category === "maps") {
      const { error: mapError } = await supabase.from("Map").insert([
        {
          baseProductId: id,
          author: product.seller || null, // Assuming the seller is the author for maps
          condition: product.condition || null,
          dimensions: product.size || null,
        },
      ]);
  
      if (mapError) {
        console.error("Error inserting into Map:", mapError);
        throw mapError;
      }
    } else if (product.category === "rare-books") {
      const { error: bookError } = await supabase.from("Book").insert([
        {
          baseProductId: id,
          author: product.seller || null, 
          genre: product.genre ? `{${product.genre.join(",")}}` : null, 
          isbn: product.isbn || null,
          language: product.language || null,
          format: product.format || "Hardcover",
          specCategory: 'rare-books',
        },
      ]);
  
      if (bookError) {
        console.error("Error inserting into Book:", bookError);
        throw bookError;
      }
    } else {
      console.warn("Category not recognized, only inserted into BaseProduct.");
    }
  
    return id;
  }
  
  

  export async function getProducts(category) {
    let query = supabase.from("products").select("*");
  
    if (category) {
      query = query.eq("category", category);
    }
  
    const { data, error } = await query;
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  
    return data;
  }
  

  export async function getProductById(productId) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();
  
    if (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  
    return data;
  }
  