import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { useState, useEffect, useCallback } from "react";

export default function WarriorBookScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Biblical verses organized by life struggles from WarriorBook.rtf
  const warriorBookData = {
    "Fear / Courage": {
      icon: "⚔️",
      color: "#dc3545",
      verses: [
        {
          reference: "Proverbs 29:25 ESV",
          text: "The fear of man lays a snare, but whoever trusts in the Lord is safe."
        },
        {
          reference: "2 Timothy 1:7 ESV",
          text: "For God gave us a spirit not of fear but of power and love and self-control."
        },
        {
          reference: "Deuteronomy 3:22 ESV",
          text: "You shall not fear them, for it is the Lord your God who fights for you."
        },
        {
          reference: "Psalm 31:24 ESV",
          text: "Be strong, and let your heart take courage, all you who wait for the Lord!"
        },
        {
          reference: "Isaiah 41:10 ESV",
          text: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand."
        },
        {
          reference: "Isaiah 12:2 ESV",
          text: "Behold, God is my salvation; I will trust, and will not be afraid; for the Lord God is my strength and my song, and he has become my salvation."
        }
      ]
    },
    "Pride / Humility": {
      icon: "🙏",
      color: "#6f42c1",
      verses: [
        {
          reference: "Proverbs 16:18 ESV",
          text: "Pride goes before destruction, and a haughty spirit before a fall"
        },
        {
          reference: "Jeremiah 9:23 ESV",
          text: "Thus says the Lord: 'Let not the wise man boast in his wisdom, let not the mighty man boast in his might, let not the rich man boast in his riches,'"
        },
        {
          reference: "Isaiah 5:21 ESV",
          text: "Woe to those who are wise in their own eyes, and shrewd in their own sight!"
        },
        {
          reference: "James 4:6 ESV",
          text: "God opposes the proud but gives grace to the humble."
        },
        {
          reference: "Psalm 25:9 ESV",
          text: "He leads the humble in what is right, and teaches the humble his way."
        },
        {
          reference: "James 4:10 ESV",
          text: "Humble yourselves before the Lord, and he will exalt you."
        }
      ]
    },
    "Anger / Love": {
      icon: "❤️",
      color: "#e83e8c",
      verses: [
        {
          reference: "James 1:20 ESV",
          text: "For the anger of man does not produce the righteousness of God."
        },
        {
          reference: "Psalm 37:8 ESV",
          text: "Refrain from anger, and forsake wrath! Fret not yourself; it tends only to evil."
        },
        {
          reference: "Ecclesiastes 7:9 ESV",
          text: "Be not quick in your spirit to become angry, for anger lodges in the heart of fools."
        },
        {
          reference: "1 Corinthians 13:4-8 ESV",
          text: "Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It does not insist on its own way; it is not irritable or resentful; it does not rejoice at wrongdoing, but rejoices with the truth. Love bears all things, believes all things, hopes all things, endures all things. Love never ends."
        },
        {
          reference: "1 Peter 4:8 ESV",
          text: "Above all, keep loving one another earnestly, since love covers a multitude of sins."
        },
        {
          reference: "1 Corinthians 16:14 ESV",
          text: "Let all that you do be done in love."
        }
      ]
    },
    "Lust / Purity": {
      icon: "✨",
      color: "#20c997",
      verses: [
        {
          reference: "Matthew 5:28 ESV",
          text: "But I say to you that everyone who looks at a woman/man with lustful intent has already committed adultery with her/him in his heart."
        },
        {
          reference: "Ephesians 5:3 ESV",
          text: "But sexual immorality and all impurity or covetousness must not even be named among you, as is proper among saints."
        },
        {
          reference: "1 Corinthians 6:18 ESV",
          text: "Flee from sexual immorality. Every other sin a person commits is outside the body, but the sexually immoral person sins against his own body."
        },
        {
          reference: "Psalm 51:10 ESV",
          text: "Create in me a clean heart, O God, and renew a right spirit within me."
        },
        {
          reference: "Matthew 5:8 ESV",
          text: "Blessed are the pure in heart, for they shall see God."
        },
        {
          reference: "Romans 13:14 ESV",
          text: "But put on the Lord Jesus Christ, and make no provision for the flesh, to gratify its desires."
        }
      ]
    },
    "Discouragement / Hope": {
      icon: "🌅",
      color: "#fd7e14",
      verses: [
        {
          reference: "Psalm 42:5 ESV",
          text: "Why are you cast down, O my soul, and why are you in turmoil within me? Hope in God; for I shall again praise him, my salvation"
        },
        {
          reference: "2 Corinthians 4:8 ESV",
          text: "We are afflicted in every way, but not crushed; perplexed, but not driven to despair;"
        },
        {
          reference: "Psalm 34:18 ESV",
          text: "The Lord is near to the brokenhearted and saves the crushed in spirit."
        },
        {
          reference: "Jeremiah 29:11 ESV",
          text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope."
        },
        {
          reference: "Romans 15:13 ESV",
          text: "May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope."
        },
        {
          reference: "Isaiah 40:31 ESV",
          text: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint."
        }
      ]
    },
    "Doubt / Faith": {
      icon: "🛡️",
      color: "#0ea5e9",
      verses: [
        {
          reference: "Hebrews 3:12 ESV",
          text: "Take care, brothers, lest there be in any of you an evil, unbelieving heart, leading you to fall away from the living God."
        },
        {
          reference: "James 1:6 ESV",
          text: "But let him ask in faith, with no doubting, for the one who doubts is like a wave of the sea that is driven and tossed by the wind."
        },
        {
          reference: "Hebrews 3:8 ESV",
          text: "Do not harden your hearts as in the rebellion, on the day of testing in the wilderness,"
        },
        {
          reference: "2 Corinthians 5:7 ESV",
          text: "For we walk by faith, not by sight."
        },
        {
          reference: "1 Corinthians 16:13 ESV",
          text: "Be watchful, stand firm in the faith, act like men, be strong."
        },
        {
          reference: "Romans 1:17 ESV",
          text: "For in it the righteousness of God is revealed from faith for faith, as it is written, 'The righteous shall live by faith.'"
        }
      ]
    },
    "Weakness / Strength": {
      icon: "💪",
      color: "#198754",
      verses: [
        {
          reference: "2 Corinthians 12:9 ESV",
          text: "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.' Therefore I will boast all the more gladly of my weaknesses, so that the power of Christ may rest upon me."
        },
        {
          reference: "Matthew 11:28 ESV",
          text: "Come to me, all who labor and are heavy laden, and I will give you rest."
        },
        {
          reference: "Jeremiah 31:25 ESV",
          text: "For I will satisfy the weary soul, and every languishing soul I will replenish."
        },
        {
          reference: "Isaiah 40:29 ESV",
          text: "He gives power to the faint, and to him who has no might he increases strength."
        },
        {
          reference: "Philippians 4:13 ESV",
          text: "I can do all things through him who strengthens me."
        },
        {
          reference: "Psalm 73:26 ESV",
          text: "My flesh and my heart may fail, but God is the strength of my heart and my portion forever."
        }
      ]
    },
    "Confusion / Focus": {
      icon: "🎯",
      color: "#6610f2",
      verses: [
        {
          reference: "1 Corinthians 14:33 ESV",
          text: "For God is not a God of confusion but of peace."
        },
        {
          reference: "Jeremiah 17:9 ESV",
          text: "The heart is deceitful above all things, and desperately sick; who can understand it?"
        },
        {
          reference: "2 Corinthians 2:11 ESV",
          text: "So that we would not be outwitted by Satan; for we are not ignorant of his designs."
        },
        {
          reference: "1 Peter 5:8 ESV",
          text: "Be sober-minded; be watchful. Your adversary the devil prowls around like a roaring lion, seeking someone to devour."
        },
        {
          reference: "Proverbs 4:25 ESV",
          text: "Let your eyes look directly forward, and your gaze be straight before you."
        },
        {
          reference: "Colossians 3:2 ESV",
          text: "Set your minds on things that are above, not on things that are on earth."
        }
      ]
    },
    "Offense / Forgiveness": {
      icon: "🕊️",
      color: "#17a2b8",
      verses: [
        {
          reference: "Proverbs 19:11 ESV",
          text: "Good sense makes one slow to anger, and it is his glory to overlook an offense."
        },
        {
          reference: "Proverbs 17:9 ESV",
          text: "Whoever covers an offense seeks love, but he who repeats a matter separates close friends."
        },
        {
          reference: "Proverbs 10:12 ESV",
          text: "Hatred stirs up strife, but love covers all offenses."
        },
        {
          reference: "Matthew 6:14-15 ESV",
          text: "For if you forgive others their trespasses, your heavenly Father will also forgive you, but if you do not forgive others their trespasses, neither will your Father forgive your trespasses."
        },
        {
          reference: "Colossians 3:13 ESV",
          text: "Bearing with one another and, if one has a complaint against another, forgiving each other; as the Lord has forgiven you, so you also must forgive."
        },
        {
          reference: "Ephesians 4:32 ESV",
          text: "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you."
        }
      ]
    },
    "Condemnation / Redeemed": {
      icon: "✝️",
      color: "#ffc107",
      verses: [
        {
          reference: "Romans 8:1 ESV",
          text: "There is now therefore no condemnation for those who are in Christ Jesus."
        },
        {
          reference: "1 John 3:20 ESV",
          text: "For whenever our heart condemns us, God is greater than our heart, and he knows everything."
        },
        {
          reference: "Psalm 34:22 ESV",
          text: "The Lord redeems the life of his servants; none of those who take refuge in him will be condemned."
        },
        {
          reference: "Ephesians 1:7 ESV",
          text: "In him we have redemption through his blood, the forgiveness of our trespasses, according to the riches of his grace,"
        },
        {
          reference: "Isaiah 44:22 ESV",
          text: "I have blotted out your transgressions like a cloud and your sins like mist; return to me, for I have redeemed you."
        },
        {
          reference: "Colossians 1:13-14 ESV",
          text: "He has delivered us from the domain of darkness and transferred us to the kingdom of his beloved Son, in whom we have redemption, the forgiveness of sins."
        }
      ]
    },
    "Worry / Trust": {
      icon: "🌿",
      color: "#28a745",
      verses: [
        {
          reference: "Philippians 4:6-7 ESV",
          text: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus."
        },
        {
          reference: "Matthew 6:34 ESV",
          text: "Therefore do not be anxious about tomorrow, for tomorrow will be anxious for itself. Sufficient for the day is its own trouble."
        },
        {
          reference: "Proverbs 12:25 ESV",
          text: "Anxiety in a man's heart weighs him down, but a good word makes him glad."
        },
        {
          reference: "Proverbs 3:5-8 ESV",
          text: "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths. Be not wise in your own eyes; fear the Lord, and turn away from evil. It will be healing to your flesh and refreshment to your bones."
        },
        {
          reference: "Jeremiah 29:11 ESV",
          text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope."
        },
        {
          reference: "2 Thessalonians 3:3 ESV",
          text: "But the Lord is faithful. He will establish you and guard you against the evil one."
        }
      ]
    },
    "Discontentment / Thankfulness": {
      icon: "🙌",
      color: "#fd7e14",
      verses: [
        {
          reference: "Philippians 2:14-15 ESV",
          text: "Do all things without grumbling or disputing, that you may be blameless and innocent, children of God without blemish in the midst of a crooked and twisted generation, among whom you shine as lights in the world,"
        },
        {
          reference: "Luke 12:15 ESV",
          text: "And he said to them, 'Take care, and be on your guard against all covetousness, for one's life does not consist in the abundance of his possessions.'"
        },
        {
          reference: "1 Timothy 6:6-7 ESV",
          text: "But godliness with contentment is great gain, for we brought nothing into the world, and we cannot take anything out of the world."
        },
        {
          reference: "1 Thessalonians 5:18 ESV",
          text: "Give thanks in all circumstances; for this is the will of God in Christ Jesus for you."
        },
        {
          reference: "James 1:17 ESV",
          text: "Every good gift and every perfect gift is from above, coming down from the Father of lights, with whom there is no variation or shadow due to change."
        },
        {
          reference: "Psalm 100:4 ESV",
          text: "Enter his gates with thanksgiving, and his courts with praise! Give thanks to him; bless his name!"
        }
      ]
    },
    "Judgment / Mercy": {
      icon: "⚖️",
      color: "#6c757d",
      verses: [
        {
          reference: "Matthew 7:1-2 ESV",
          text: "Judge not, that you be not judged. For with the judgment you pronounce you will be judged, and with the measure you use it will be measured to you."
        },
        {
          reference: "Romans 14:12-13 ESV",
          text: "So then each of us will give an account of himself to God. Therefore let us not pass judgment on one another any longer, but rather decide never to put a stumbling block or hindrance in the way of a brother."
        },
        {
          reference: "John 7:24 ESV",
          text: "Do not judge by appearances, but judge with right judgment."
        },
        {
          reference: "Luke 6:36 ESV",
          text: "Be merciful, even as your Father is merciful."
        },
        {
          reference: "James 2:13 ESV",
          text: "For judgment is without mercy to one who has shown no mercy. Mercy triumphs over judgment."
        },
        {
          reference: "Psalm 103:8 ESV",
          text: "The Lord is merciful and gracious, slow to anger and abounding in steadfast love."
        }
      ]
    }
  };

  // Filter categories based on search
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredCategories(Object.keys(warriorBookData));
    } else {
      const filtered = Object.keys(warriorBookData).filter(category =>
        category.toLowerCase().includes(searchText.toLowerCase()) ||
        warriorBookData[category].verses.some(verse =>
          verse.text.toLowerCase().includes(searchText.toLowerCase()) ||
          verse.reference.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredCategories(filtered);
    }
  }, [searchText]);

  useEffect(() => {
    setFilteredCategories(Object.keys(warriorBookData));
  }, []);

  // Handle category selection
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  // Back button handler
  const backPressed = () => {
    navigation.navigate("Home");
  };

  // Render category item
  const renderCategoryItem = ({ item }) => {
    const categoryData = warriorBookData[item];
    return (
      <TouchableOpacity
        style={[styles.categoryCard, { borderLeftColor: categoryData.color }]}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryHeader}>
          <View style={styles.categoryIconContainer}>
            <Text style={styles.categoryIcon}>{categoryData.icon}</Text>
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{item}</Text>
            <Text style={styles.categorySubtitle}>
              {categoryData.verses.length} verses available
            </Text>
          </View>
          <Text style={styles.categoryArrow}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render verse item in modal
  const renderVerseItem = ({ item }) => (
    <View style={styles.verseCard}>
      <Text style={styles.verseReference}>{item.reference}</Text>
      <Text style={styles.verseText}>"{item.text}"</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Warrior Book ⚔️</Text>
          <Text style={styles.subtitle}>Biblical verses for life's battles</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search struggles or verses..."
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Categories List */}
      <View style={styles.content}>
        <FlatList
          data={filteredCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Back Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.backButton} onPress={backPressed}>
          <Text style={styles.backButtonText}>BACK TO HOME</Text>
        </TouchableOpacity>
      </View>

      {/* Verses Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalIcon}>
                  {selectedCategory ? warriorBookData[selectedCategory]?.icon : ""}
                </Text>
                <Text style={styles.modalTitle}>{selectedCategory}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedCategory && (
              <FlatList
                data={warriorBookData[selectedCategory]?.verses || []}
                renderItem={renderVerseItem}
                keyExtractor={(item, index) => `${selectedCategory}-${index}`}
                contentContainerStyle={styles.versesList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#2c3e50",
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 5,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textAlign: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "white",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  categoriesList: {
    paddingBottom: 20,
  },
  categoryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 14,
    color: "#666",
  },
  categoryArrow: {
    fontSize: 24,
    color: "#666",
  },
  bottomSection: {
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  backButtonText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
  },
  versesList: {
    padding: 20,
  },
  verseCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
  },
  verseReference: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 8,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    fontStyle: "italic",
  },
};