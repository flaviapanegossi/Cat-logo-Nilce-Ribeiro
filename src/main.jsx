import React,{useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Search,ShoppingBag,Menu,X,ArrowUpRight,ChevronDown,Heart,MessageCircle,Ruler,Box,SlidersHorizontal,Trash2} from 'lucide-react';
import {products} from './catalogData';
import {additionalProducts} from './additionalProducts';
import './styles.css';

const formatMeasurements=size=>{
 const values=String(size).split('×').map(value=>value.trim());
 const labels=['A','L','Fundo'];
 return values.map((value,index)=>`${labels[index]||'Medida'}: ${/cm$/i.test(value)?value:`${value} cm`}`).join(' · ');
};
  const normalizedImage=image=>`/catalog-normalized/${image.split('/').pop().replace(/\.[^.]+$/,'.png')}?v=20260909-13`;

function App(){
 const [query,setQuery]=useState('');
 const [category,setCategory]=useState('Todos');
 const [menu,setMenu]=useState(false);
 const [liked,setLiked]=useState([]);
 const [selected,setSelected]=useState(null);
 const [cart,setCart]=useState([]);
 const [cartOpen,setCartOpen]=useState(false);
 const searchRef=useRef(null);
 const categories=['Todos','Clássicas','Estruturadas','Grandes','Pequenas','Mochilas'];
 const catalogProducts=useMemo(()=>[...products,...additionalProducts],[ ]);
 const filtered=useMemo(()=>catalogProducts.filter(p=>(category==='Todos'||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase())),[catalogProducts,query,category]);
 const add=p=>setCart(items=>items.some(x=>x.name===p.name)?items.map(x=>x.name===p.name?{...x,qty:x.qty+1}:x):[...items,{...p,qty:1}]);
 const addAndShow=p=>{
  add(p);
  setCartOpen(true);
 };
 const send=()=>{
  const lines=['Quero informações sobre essas bolsas:',...cart.map(x=>`Modelo: ${x.name}`)];
  window.open('https://wa.me/5562985908525?text='+encodeURIComponent(lines.join('\n')),'_blank');
 };

 return <>
  <header>
   <div className="top" aria-hidden="true"/>
   <nav>
    <button className="icon mobile" aria-label="Abrir menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    <a className="logo" href="#inicio"><span>NR</span><small>Nilce Ribeiro</small><em>SINCE 1995</em></a>
    <div className={'links '+(menu?'open':'')}><a href="#catalogo">Catálogo</a></div>
    <div className="actions"><label><button className="search-trigger" type="button" aria-label="Focar busca" onClick={()=>searchRef.current?.focus()}><Search size={18}/></button><input ref={searchRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar modelo" aria-label="Buscar modelo"/></label><button className="icon" aria-label="Abrir carrinho" onClick={()=>setCartOpen(true)}><ShoppingBag/><b>{cart.reduce((n,x)=>n+x.qty,0)}</b></button></div>
   </nav>
  </header>
  <main id="inicio">
   <section className="hero"><div><p className="eyebrow">Catálogo</p><h1><span className="hero-title-line">Bolsa</span><br/><span className="hero-title-line">de couro</span><br/><i>legítimo.</i></h1><p className="lead">Fabricação própria, atacado e varejo. <span className="hero-support-line">Atendemos todo Brasil.</span></p><a className="button" href="#catalogo">Ver catálogo <ArrowUpRight size={17}/></a></div><div className="hero-card"><img src="/catalog-hero.png" alt="Bolsas de couro legítimo"/><span>Nilce Ribeiro<br/><strong>fabricação própria.</strong></span></div></section>
   <section className="trust"><div><strong>01</strong><span>Couro legítimo</span></div><div><strong>02</strong><span>Fabricação própria</span></div><div><strong>03</strong><span>Atacado<br/>a partir de 7 bolsas</span></div><div><strong>04</strong><span>Enviamos para<br/>todo Brasil</span></div></section>
   <section id="catalogo" className="catalog">
    <div className="section-head"><div><p className="eyebrow">Coleção completa</p><h2>Escolha seus<br/><i>modelos.</i></h2></div><p className="count">{filtered.length} modelos</p></div>
    <div className="filters"><SlidersHorizontal size={16}/>{categories.map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}<button className="sort">Mais recentes <ChevronDown size={16}/></button></div>
    <div className="grid">{filtered.map((p,i)=><article className="product" key={p.name}>
     <button className="photo" onClick={()=>setSelected(p)} aria-label={'Ver detalhes da '+p.name}><img src={normalizedImage(p.image)} alt={p.name}/><div className="photo-shade"/>{i<3&&<span className="badge">Mais vendidas</span>}<span className="tone">Couro legítimo</span></button>
     <button className="heart" onClick={()=>setLiked(l=>l.includes(p.name)?l.filter(x=>x!==p.name):[...l,p.name])} aria-label="Favoritar"><Heart size={18} fill={liked.includes(p.name)?'currentColor':'none'}/></button>
     <div className="product-info"><div className="meta"><span>{p.category}</span><span>NR {String(i+1).padStart(2,'0')}</span></div><h3>{p.name}</h3><p>{p.description}</p><div className="size">{formatMeasurements(p.size)}</div><div className="price"><strong>R$ {p.price}</strong></div><button className="interest" onClick={()=>addAndShow(p)} aria-label={'Adicionar '+p.name+' à seleção'}>Adicionar esta bolsa <ShoppingBag size={17}/></button></div>
    </article>)}</div>
   </section>
   <section className="terms"><div><p className="eyebrow">Condições especiais</p><h2>Monte seu pedido<br/><i>do seu jeito.</i></h2></div><div><p>Valor de Atacado</p><strong>20% de desconto para pagamento à vista</strong><strong>15% de desconto pagamento a prazo</strong><small>No atacado, o pedido mínimo é de 7 bolsas. Escolha os modelos e envie tudo de uma vez pelo WhatsApp.</small></div></section>
  </main>
  <footer><a className="logo" href="#inicio"><span>NR</span><small>Nilce Ribeiro</small><em>SINCE 1995</em></a><p>Bolsas de couro legítimo · Fabricação própria</p><span>© 2026 Nilce Ribeiro · Catálogo desenvolvido por <a className="creator-link" href="https://www.instagram.com/midioramarketing/" target="_blank" rel="noreferrer">Midiora</a></span></footer>
  {selected&&<div className="overlay" onClick={()=>setSelected(null)}><section className="details" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)} aria-label="Fechar"><X/></button><img src={normalizedImage(selected.image)} alt={selected.name}/><div><p className="eyebrow">{selected.category} · Couro legítimo</p><h2>{selected.name}</h2><div className="detail-retail"><strong className="detail-price">R$ {selected.price}</strong><span>Valor no varejo</span></div><div className="detail-discounts"><strong>Atacado</strong><span>20% de desconto para pagamento à vista</span><span>15% de desconto no pagamento a prazo</span></div><p className="detail-description">{selected.description}</p><dl><div><dt><Ruler size={15}/> Medidas</dt><dd>{formatMeasurements(selected.size)}</dd></div><div><dt><Box size={15}/> Atacado</dt><dd>A partir de 7 bolsas</dd></div></dl><button className="button" onClick={()=>{addAndShow(selected);setSelected(null)}} aria-label={'Adicionar '+selected.name+' à seleção'}>Adicionar esta bolsa <ShoppingBag size={17}/></button></div></section></div>}
  {cartOpen&&<div className="overlay" onClick={()=>setCartOpen(false)}><section className="cart" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setCartOpen(false)} aria-label="Fechar"><X/></button><p className="eyebrow">Sua seleção</p><h2>Carrinho <i>de modelos.</i></h2>{cart.length?<><div className="cart-items">{cart.map(item=><div className="cart-item" key={item.name}><img src={normalizedImage(item.image)} alt=""/><div><strong>{item.name}</strong><span>R$ {item.price} · {formatMeasurements(item.size)}</span><small>Quantidade: {item.qty}</small></div><button onClick={()=>setCart(c=>c.filter(x=>x.name!==item.name))} aria-label={'Remover '+item.name}><Trash2 size={17}/></button></div>)}</div><button className="button" onClick={send}>Enviar seleção pelo WhatsApp <MessageCircle size={17}/></button></>:<div className="cart-empty"><ShoppingBag size={30}/><p>Seu carrinho está vazio.</p><button onClick={()=>setCartOpen(false)}>Voltar ao catálogo</button></div>}</section></div>}
 </>;
}

createRoot(document.getElementById('root')).render(<App/>);
