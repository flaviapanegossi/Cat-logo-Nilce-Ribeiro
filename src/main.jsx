import React,{useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Search,ShoppingBag,Menu,X,ArrowUpRight,ChevronDown,ChevronLeft,ChevronRight,Heart,MessageCircle,Ruler,Box,SlidersHorizontal,Trash2} from 'lucide-react';
import {products} from './catalogData';
import {additionalProducts} from './additionalProducts';
import './styles.css';

const formatMeasurements=size=>{
 const values=String(size).split('×').map(value=>value.trim());
 const labels=['A','L','Fundo'];
 return values.map((value,index)=>`${labels[index]||'Medida'}: ${/cm$/i.test(value)?value:`${value} cm`}`).join(' · ');
};
  const normalizedImage=image=>`/catalog-normalized/${image.split('/').pop().replace(/\.[^.]+$/,'.png')}?v=20260909-42`;
const galleryImages={
 'Bolsa Kelly 3':[
  '/catalog-original/product-14.avif',
  '/catalog-original/kelly3-branca.png',
  '/catalog-original/kelly3-vermelha.png',
  '/catalog-original/kelly3-preta.png',
 '/catalog-original/kelly3-marrom.png'
 ],
 'Bolsa Chanel GG':[
  '/catalog-original/product-11.avif',
 '/catalog-original/chanel-gg-vermelha.png',
 '/catalog-original/chanel-gg-caramelo.png',
  '/catalog-original/chanel-gg-verde.png'
 ],
 'Canoa Chanel Grande':[
  '/catalog-original/canoa-chanel-grande.png',
  '/catalog-original/chanel-grande-preta.jpg',
  '/catalog-original/chanel-grande-marrom.jpg',
  '/catalog-original/chanel-grande-creme.jpg'
 ],
 'Bolsa Tânia':[
  '/catalog-original/tania-oliva.jpg',
  '/catalog-original/tania-preta.jpg'
 ],
 'Bolsa Help':[
  '/catalog-original/help-vermelha.jpg',
  '/catalog-original/help-caramelo.jpg',
  '/catalog-original/help-preta.jpg',
  '/catalog-original/help-marrom.jpg'
 ],
 'Bolsa Baú Mole':[
  '/catalog-original/bau-mole-caramelo.jpg',
  '/catalog-original/bau-mole-preta.jpg',
  '/catalog-original/bau-mole-offwhite.jpg'
 ],
 'Bolsa Chanel GG s/ Tampa':[
  '/catalog-original/product-13.avif',
  '/catalog-original/chanel-gg-sem-tampa-branca.png',
  '/catalog-original/chanel-gg-sem-tampa-caramelo.png',
  '/catalog-original/chanel-gg-sem-tampa-vermelha.png',
  '/catalog-original/chanel-gg-sem-tampa-preta.png',
 '/catalog-original/chanel-gg-sem-tampa-marrom.png'
 ],
 'Bolsa Charlotte':[
  '/catalog-original/product-05.avif',
  '/catalog-original/charlotte-preta.jpg',
  '/catalog-original/charlotte-bege.jpg',
 '/catalog-original/charlotte-marrom.jpg'
 ],
 'Bolsa Baú Baby':[
  '/catalog-original/product-02.avif',
  '/catalog-original/bau-baby-preta.jpg',
  '/catalog-original/bau-baby-bege.jpg'
 ],
 'Bolsa Chanel 3D':[
  '/catalog-original/chanel-3d-preta.jpg',
  '/catalog-original/chanel-3d-dourada.jpg',
  '/catalog-original/chanel-3d-branca.jpg',
  '/catalog-original/chanel-3d-caramelo.jpg'
 ],
 'Bolsa Balenciaga P':[
  '/catalog-original/balenciaga-p-caramelo.jpg',
  '/catalog-original/balenciaga-p-bege.jpg',
  '/catalog-original/balenciaga-p-preta.jpg',
  '/catalog-original/balenciaga-p-branca.jpg'
 ],
 'Bolsa Neuci':[
  '/catalog-original/product-20.avif',
  '/catalog-original/neuci-vinho.jpg',
  '/catalog-original/neuci-preta.jpg',
  '/catalog-original/neuci-caramelo.jpg',
  '/catalog-original/neuci-bege.jpg'
 ],
 'Bolsa Bella':[
  '/catalog-original/bella-preta.jpg',
  '/catalog-original/bella-marrom.jpg',
  '/catalog-original/bella-vermelha.jpg',
  '/catalog-original/bella-laranja.jpg',
  '/catalog-original/bella-branca.jpg',
  '/catalog-original/bella-caramelo.jpg'
 ],
 'Bolsa Lia 02':[
  '/catalog-original/lia-02-preta.jpg',
  '/catalog-original/lia-02-vermelha.jpg',
  '/catalog-original/lia-02-marrom.jpg'
 ],
 'Bolsa Canoa Meia Lua':[
  '/catalog-original/canoa-meia-lua-laranja-atualizada.jpg',
  '/catalog-original/canoa-meia-lua-marrom-atualizada.jpg',
  '/catalog-original/canoa-meia-lua-preta-atualizada.jpg',
  '/catalog-original/canoa-meia-lua-vermelha-atualizada.jpg',
  '/catalog-original/canoa-meia-lua-branca.jpg'
 ],
 'Bolsa Cesta':[
  '/catalog-original/cesta-amarela.jpg',
  '/catalog-original/cesta-vermelha.jpg',
  '/catalog-original/cesta-marrom.jpg',
  '/catalog-original/cesta-preta.jpg',
  '/catalog-original/cesta-laranja.jpg'
 ],
 'Bolsa GG com Ilhóis':[
  '/catalog-original/gg-ilhois-taupe.jpg',
  '/catalog-original/gg-ilhois-preta.jpg',
  '/catalog-original/gg-ilhois-caramelo.jpg',
  '/catalog-original/gg-ilhois-marrom.jpg'
 ],
 'Bolsa Veneza':[
  '/catalog-original/veneza-principal.png',
  '/catalog-original/veneza-branca.jpg',
  '/catalog-original/veneza-caramelo.jpg',
  '/catalog-original/veneza-preta.jpg',
  '/catalog-original/veneza-taupe.jpg'
 ],
 'Bolsa Malu (Coração)':[
  '/catalog-original/product-10.avif',
  '/catalog-original/malu-caramelo.jpg',
  '/catalog-original/malu-branca.jpg',
  '/catalog-original/malu-marrom.jpg'
 ],
 'Bolsa Boneca':[
  '/catalog-original/product-09.avif',
  '/catalog-original/boneca-preta.jpg',
  '/catalog-original/boneca-caramelo.jpg',
  '/catalog-original/boneca-branca.jpg',
  '/catalog-original/boneca-prata.jpg'
 ],
 'Bolsa Saco LV':[
  '/catalog-original/saco-lv-principal.png',
  '/catalog-original/saco-lv-branca.jpg',
  '/catalog-original/saco-lv-caramelo.jpg',
  '/catalog-original/saco-lv-vinho.jpg'
 ],
 'Bolsa Aurora':[
  '/catalog-original/product-06.avif',
  '/catalog-original/aurora-preta.jpg',
  '/catalog-original/aurora-caramelo.jpg',
  '/catalog-original/aurora-bege.jpg'
 ],
 'Bolsa R7':[
  '/catalog-original/product-08-corrected.png',
  '/catalog-original/r7-preta.jpg',
  '/catalog-original/r7-branca.jpg',
  '/catalog-original/r7-bege.jpg'
 ],
 'Bolsa Baguete Social':[
  '/catalog-original/baguete-social-principal.png',
  '/catalog-original/baguete-social-preta.jpg',
  '/catalog-original/baguete-social-marrom-escura.jpg',
  '/catalog-original/baguete-social-branca.jpg'
 ]
};
const galleryFor=product=>galleryImages[product.name]||[product.image];

function App(){
 const [query,setQuery]=useState('');
 const [category,setCategory]=useState('Todos');
 const [menu,setMenu]=useState(false);
 const [liked,setLiked]=useState([]);
 const [selected,setSelected]=useState(null);
 const [cart,setCart]=useState([]);
 const [cartOpen,setCartOpen]=useState(false);
 const [slideIndexes,setSlideIndexes]=useState({});
 const [modalSlide,setModalSlide]=useState(0);
 const searchRef=useRef(null);
 const categories=['Todos','Clássicas','Estruturadas','Grandes','Pequenas','Mochilas'];
 const catalogProducts=useMemo(()=>[...products,...additionalProducts],[ ]);
 const filtered=useMemo(()=>catalogProducts.filter(p=>(category==='Todos'||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase())),[catalogProducts,query,category]);
 const add=p=>setCart(items=>items.some(x=>x.name===p.name)?items.map(x=>x.name===p.name?{...x,qty:x.qty+1}:x):[...items,{...p,image:galleryFor(p)[0],qty:1}]);
 const addAndShow=p=>{
  add(p);
  setCartOpen(true);
 };
 const send=()=>{
  const lines=['Quero informações sobre essas bolsas:',...cart.map(x=>`Modelo: ${x.name}`)];
  window.open('https://wa.me/5562985908525?text='+encodeURIComponent(lines.join('\n')),'_blank');
 };
 const changeSlide=(name,next,total)=>setSlideIndexes(current=>({...current,[name]:(next+total)%total}));
 const openDetails=(product,index=0)=>{setModalSlide(index);setSelected(product)};

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
    <div className="grid">{filtered.map((p,i)=>{const gallery=galleryFor(p);const slideIndex=slideIndexes[p.name]||0;return <article className="product" key={p.name}>
     <div className="photo" role="button" tabIndex={0} onClick={()=>openDetails(p,slideIndex)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetails(p,slideIndex)}}} aria-label={'Ver detalhes da '+p.name}><div className="photo-visual"><img src={normalizedImage(gallery[slideIndex])} alt={p.name}/><div className="photo-shade"/>{i<3&&<span className="badge">Mais vendidas</span>}<span className="tone">Couro legítimo</span>{gallery.length>1&&<div className="gallery-controls" onClick={e=>e.stopPropagation()}><button type="button" aria-label="Imagem anterior" onClick={()=>changeSlide(p.name,slideIndex-1,gallery.length)}><ChevronLeft size={16}/></button><div className="gallery-dots" aria-label="Variações de cor">{gallery.map((_,index)=><button type="button" className={index===slideIndex?'active':''} aria-label={'Ver variação '+(index+1)} onClick={()=>changeSlide(p.name,index,gallery.length)} key={index}/>)}</div><button type="button" aria-label="Próxima imagem" onClick={()=>changeSlide(p.name,slideIndex+1,gallery.length)}><ChevronRight size={16}/></button></div>}</div></div>
     <button className="heart" onClick={()=>setLiked(l=>l.includes(p.name)?l.filter(x=>x!==p.name):[...l,p.name])} aria-label="Favoritar"><Heart size={18} fill={liked.includes(p.name)?'currentColor':'none'}/></button>
     <div className="product-info"><div className="meta"><span>{p.category}</span><span>NR {String(i+1).padStart(2,'0')}</span></div><h3>{p.name}</h3><p>{p.description}</p><div className="size">{formatMeasurements(p.size)}</div><div className="price"><strong>R$ {p.price}</strong></div><button className="interest" onClick={()=>addAndShow(p)} aria-label={'Adicionar '+p.name+' à seleção'}>Adicionar esta bolsa <ShoppingBag size={17}/></button></div>
    </article>})}</div>
   </section>
   <section className="terms"><div><p className="eyebrow">Condições especiais</p><h2>Monte seu pedido<br/><i>do seu jeito.</i></h2></div><div><p>Valor de Atacado</p><strong>20% de desconto para pagamento à vista</strong><strong>15% de desconto pagamento a prazo</strong><small>No atacado, o pedido mínimo é de 7 bolsas. Escolha os modelos e envie tudo de uma vez pelo WhatsApp.</small></div></section>
  </main>
  <footer><a className="logo" href="#inicio"><span>NR</span><small>Nilce Ribeiro</small><em>SINCE 1995</em></a><p>Bolsas de couro legítimo · Fabricação própria</p><span>© 2026 Nilce Ribeiro · Catálogo desenvolvido por <a className="creator-link" href="https://www.instagram.com/midioramarketing/" target="_blank" rel="noreferrer">Midiora</a></span></footer>
  {selected&&(()=>{const gallery=galleryFor(selected);const image=gallery[modalSlide]||gallery[0];return <div className="overlay" onClick={()=>setSelected(null)}><section className="details" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)} aria-label="Fechar"><X/></button><div className="details-media"><img src={normalizedImage(image)} alt={selected.name}/>{gallery.length>1&&<div className="gallery-controls"><button type="button" aria-label="Imagem anterior" onClick={()=>setModalSlide(index=>(index-1+gallery.length)%gallery.length)}><ChevronLeft size={18}/></button><div className="gallery-dots" aria-label="Variações de cor">{gallery.map((_,index)=><button type="button" className={index===modalSlide?'active':''} aria-label={'Ver variação '+(index+1)} onClick={()=>setModalSlide(index)} key={index}/>)}</div><button type="button" aria-label="Próxima imagem" onClick={()=>setModalSlide(index=>(index+1)%gallery.length)}><ChevronRight size={18}/></button></div>}</div><div><p className="eyebrow">{selected.category} · Couro legítimo</p><h2>{selected.name}</h2><div className="detail-retail"><strong className="detail-price">R$ {selected.price}</strong><span>Valor no varejo</span></div><div className="detail-discounts"><strong>Atacado</strong><span>20% de desconto para pagamento à vista</span><span>15% de desconto no pagamento a prazo</span></div><p className="detail-description">{selected.description}</p><dl><div><dt><Ruler size={15}/> Medidas</dt><dd>{formatMeasurements(selected.size)}</dd></div><div><dt><Box size={15}/> Atacado</dt><dd>A partir de 7 bolsas</dd></div></dl><button className="button" onClick={()=>{addAndShow(selected);setSelected(null)}} aria-label={'Adicionar '+selected.name+' à seleção'}>Adicionar esta bolsa <ShoppingBag size={17}/></button></div></section></div>})()}
  {cartOpen&&<div className="overlay" onClick={()=>setCartOpen(false)}><section className="cart" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setCartOpen(false)} aria-label="Fechar"><X/></button><p className="eyebrow">Sua seleção</p><h2>Carrinho <i>de modelos.</i></h2>{cart.length?<><div className="cart-items">{cart.map(item=><div className="cart-item" key={item.name}><img src={normalizedImage(item.image)} alt=""/><div><strong>{item.name}</strong><span>R$ {item.price} · {formatMeasurements(item.size)}</span><small>Quantidade: {item.qty}</small></div><button onClick={()=>setCart(c=>c.filter(x=>x.name!==item.name))} aria-label={'Remover '+item.name}><Trash2 size={17}/></button></div>)}</div><button className="button" onClick={send}>Enviar seleção pelo WhatsApp <MessageCircle size={17}/></button></>:<div className="cart-empty"><ShoppingBag size={30}/><p>Seu carrinho está vazio.</p><button onClick={()=>setCartOpen(false)}>Voltar ao catálogo</button></div>}</section></div>}
 </>;
}

createRoot(document.getElementById('root')).render(<App/>);
