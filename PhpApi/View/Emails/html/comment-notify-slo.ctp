<?php
$user_name = explode(' ', $comment['name']);

$name_from = $user_role == 'admin' ? "Moderator" : $user_name[0] . '' . substr($user_name[1], 0, 1);

if($parent) {
    $user_parent_name = explode(' ', $parent['name']);
    $parent_name = $user_role == 'admin' ? $parent['name'] : $user_parent_name[0] . '' . substr($user_parent_name[1], 0, 1);

    // meno zobrazene pre admina ak je parent admin
    if($parent_user['role_id'] == 1) {
        $name_from = $comment['name'];
        $parent_name = $parent['name'];
    }

}
?>
Dobry den,

Bola vam zaslaná notifikácia z iqual.sk od: <strong> <?php echo $name_from ?></strong>

<br><br>

<strong>Projekt:</strong> <?php echo $Project['name'] ?><br>
<strong>Téma:</strong>  <?php echo $Theme['name'] ?><br>
<br><br>
Správa:
<br> <br>

<?php  if($parent) {  ?>
    <div style="padding: 10px;background: #dedede">
        <strong> "<?php echo $parent['text']; ?>"</strong>
        <br><br>
        <em><?php echo $parent_name ?> &mdash; <?php echo date("d.m. Y  H:i:s", strtotime($parent['created'])) ?></em>
    </div>
    <div style="padding: 10px; margin-left:40px; background: #f5f5f5">
        <strong> "<?php echo $comment['text']; ?>"</strong>
        <br><br>
        <em><?php echo $name_from ?> &mdash; <?php echo date("d.m. Y  H:i:s", strtotime($comment['created'])) ?></em>
    </div>
<?php } else { ?>
    <div style="padding: 10px; background: #f5f5f5">
        <strong> "<?php echo $comment['text']; ?>"</strong>
        <br><br>
        <em><?php echo $name_from ?> &mdash; <?php echo date("d.m. Y  H:i:s", strtotime($comment['created'])) ?></em>
    </div>
<?php } ?>


<br><br>
Na túto správu <strong>neodpovedajte</strong>, slúži len pre informáciu, pre odpoveď použite nasledujúci odkaz:
<br>
<a href="<?php echo FULL_BASE_URL ?>/api/public/comment/slo/<?php echo $comment['id'] ?>/<?php echo $comment['hash'] ?>">Reaguj na notifikáciu</a>

<br><br>




