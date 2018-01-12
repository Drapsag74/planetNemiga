\c 'planetNemiga';
TRUNCATE TABLE challenges.chapitres CASCADE;
TRUNCATE TABLE challenges.enigmes CASCADE;

INSERT INTO challenges.chapitres VALUES('proba','math');
INSERT INTO challenges.chapitres VALUES('pythagore', 'math');

INSERT INTO challenges.enigmes VALUES (1,'Le grand immeuble','
   <div class="main container" style="background-image:url(''/images/EnigmePorte.jpg;'')">
    <div class="ui two row column">

      <div class="sixteen wide column" id="TitreE">
        <h2 class="ui h2">Un immeuble</h2>
        <p>Un immeuble a une base rectangulaire avec un côté de 40m,
              sa diagonale mesure 50m. En marchant à 3m/s, combien de
              temps faut-il pour faire le tour de l''immeuble ?(arrondir a l''unité)</p>
      </div>
      <br>

      <div class="sixteen wide column">
        <img class="ui medium centered image" src="/images/busteScientist.png" alt="">
      </div>
      <div class="ui grid">
        <div class="sixteen wide column">
          <div class="ui segment" align="right" style=" text-align = center;">
            <div id="reponse">
              <h3 align="center">reponse</h3>
            </div>
            <br>
            <form action="/pageEnigme" method="post">
              <div class="ui center align page grid input focus">
                <input type="text" name="reponse" style="text-align : center;">
              </div>
              <br>
              <div style="text-align : center;">
                <button class="ui button primary" type="button" name="effacer"> effacer</button>
                <button class="ui button primary" type="submit" name="idEnigme" value={{id}}> envoyer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
',1,1, 'pythagore');

INSERT INTO challenges.reponses VALUES (1,'47',1);

INSERT INTO challenges.enigmes VALUES (2,'Probabilité','<div class="main container" style="background-image:url(''/images/EnigmePorte.jpg;'')">
    <div class="ui two row column">

      <div class="sixteen wide column" id="TitreE">
        <h2 class="ui h2">Probabilité</h2>
        <p>Une porte se présente à vous, pour la franchit il
              vous faut une clé bleu. Un second verrou bloque la
               porte, pour l''ouvrir il vous faut une clé verte.
               Dans une urne il y a 3 clés bleues(B), 3 clés vertes(V),
                et 3 clés marrons(M), indiscernables au toucher. On tire
                 successivement et sans remise deux boules. <br>
                 Quelle est la probabilité de tirer une première
                 clé bleu et une seconde clé verte ?(un arbre de
                 probabilités pourrait vous aider)</p>
      </div>
      <br>

      <div class="sixteen wide column">
        <img class="ui medium centered image" src="/images/busteScientist.png" alt="">
      </div>
      <div class="ui grid">
        <div class="sixteen wide column">
          <div class="ui segment" align="right" style=" text-align = center;">
            <div id="reponse">
              <h3 align="center">reponse</h3>
            </div>
            <br>
            <form action="/pageEnigme" method="post">
              <div class="ui center align page grid input focus">
                <input type="text" name="reponse" style="text-align : center;">
              </div>
              <br>
              <div style="text-align : center;">
                <button class="ui button primary" type="button" name="effacer"> effacer</button>
                <button class="ui button primary" type="submit" name="idEnigme" value={{id}}> envoyer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
',1,1, 'proba');
INSERT INTO challenges.reponses VALUES (2,'9/72',2);

INSERT INTO challenges.enigmes VALUES (3,'PLANET','<div class="main container">
     <div class="ui grid">
       <div class="ui two row column">

         <div class="sixteen wide column" id="TitreE">
           <h2 class="ui h2">Trouver le mot</h2>
           <p>Les lettres de l''alphabet sont numérotées de 1 à 26
              (A vaut 1, Z vaut 26). En résolvant les équations trouvez
               le mot de passe !<br>

               x + 3 = 19 <br>
               -(x/2) + x = 18 - x <br>
               3(x-1) = 4(-x + 1) <br>
               8 + x - 20 = x/7 <br>
               3(5x+9) = -98 + 8(5x) <br>
               (x/2) + (20/x) = sqrt(121) <br></p>
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
'
,1,1);

INSERT INTO challenges.reponses VALUES (3,'planet',3);

INSERT INTO challenges.enigmes VALUES (4,'Une enigme de pythagore plus dure', '<div class="main container">
     <div class="ui grid">
       <div class="ui two row column">

         <div class="sixteen wide column" id="TitreE">
           <h2 class="ui h2">Une enigme de pythagore plus dure</h2>
           <p>Une enigme plus dur ! </p>
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
',1,2, 'pythagore');
INSERT INTO challenges.reponses VALUES (4,'42',4);