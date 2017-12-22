\c 'planetNemiga';
INSERT INTO challenges.enigmes(2,'','<div class="main container">
     <div class="ui grid">
       <div class="ui two row column">

         <div class="sixteen wide column" id="TitreE">
           <h2 class="ui h2">Un immeuble</h2>
           <p>Un immeuble a une base rectangulaire avec un côté de 15m,
              sa diagonale mesure 30m. En marchant à 3m/s, combien de
              temps faut-il pour faire le tour de l\'immeuble ?</p>
         </div>
         <br>

         <div class="ui segment" align="right">

           <div id="reponse">
             <h3 align="center">reponse</h3>
           </div>
           <form action="/pageEnigme" method="post">
             <div class="ui input focus">
               <input type="text" name="reponse">
             </div>
             <div>
               <button class="ui button primary" type="submit" name="idEnigme" value={{id}}> envoyer</button>
             </div>
           </form>

         </div>
       </div>


     </div>

   </div>
',1,1);
