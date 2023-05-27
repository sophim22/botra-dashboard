
class homeController {
  index = async (req, res) => {
    res.render("index", {
      title: 'Home',
    });
  };
}
export default new homeController();
