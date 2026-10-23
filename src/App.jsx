import { useReducer, useState, useCallback, useMemo, useEffect } from 'react';
import useFetchPhotos from './hooks/useFetchPhotos';

function favReducer(state, action) {
  switch(action.type){
    case 'TOGGLE': return state.includes(action.id) ? state.filter(i=>i!==action.id) : [...state, action.id];
    default: return state;
  }
}

export default function App(){
  const { photos, loading, error } = useFetchPhotos();
  const [search, setSearch] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  const [favourites, dispatch] = useReducer(favReducer, [], () => {
    const s = localStorage.getItem('favourites');
    return s ? JSON.parse(s) : [];
  });

  useEffect(()=>{ localStorage.setItem('favourites', JSON.stringify(favourites)) }, [favourites]);
  const handleSearch = useCallback((e)=>setSearch(e.target.value), []);

  const filtered = useMemo(()=>{
    let list = photos;
    if(favOnly) list = list.filter(p=>favourites.includes(p.id));
    if(search) list = list.filter(p=>p.author.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [photos, search, favOnly, favourites]);

  if(loading) return <div className="h-screen flex flex-col items-center justify-center bg-[#faf8ff]"><div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div><p className="mt-3 text-violet-600 font-medium">Loading gallery...</p></div>
  if(error) return <p className="text-center mt-20 text-red-500">{error}</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcf8ff] to-[#eef2ff]">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row gap-3 justify-between items-center">
          <div>
            <h1 className="text-[22px] md:text-3xl font-black tracking-tight"> <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Celebrare</span> Gallery </h1>
            <p className="text-xs text-gray-500 mt-0.5">{filtered.length} images • {favourites.length} liked</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <span className="absolute left-3.5 top-3 text-gray-400">⌕</span>
              <input value={search} onChange={handleSearch} placeholder="Search author..." className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 focus:bg-white border border-transparent focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none text-sm transition-all" />
            </div>
            <button onClick={()=>setFavOnly(!favOnly)} className={`px-4 py-2.5 rounded-full text-sm font-bold border shadow-sm transition ${favOnly ? 'bg-pink-600 text-white border-pink-600' : 'bg-white'}`}>{favOnly ? '❤️ Fav' : '🤍 Fav'}</button>
          </div>
        </div>
      </header>

       <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(photo=>(
            <div key={photo.id} className="group bg-white rounded-[22px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={`https://picsum.photos/id/${photo.id}/600/450`} alt={photo.author} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <button onClick={()=>dispatch({type:'TOGGLE', id:photo.id})} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition text-[18px]">
                  {favourites.includes(photo.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={`https://picsum.photos/id/${photo.id}/40/40`} className="w-7 h-7 rounded-full object-cover" alt="" />
                  <p className="text-[13px] font-semibold text-gray-800 truncate max-w-[120px]">{photo.author}</p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-violet-50 text-violet-600 font-medium">#{photo.id}</span>
              </div>
            </div>
          ))}
        </div>
        {filtered.length===0 && <p className="text-center py-24 text-gray-400">No match for "{search}"</p>}
      </main>
    </div>
  )
}